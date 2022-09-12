import json
import boto3

ENDPOINT = "https://45dl55ctc3.execute-api.us-east-1.amazonaws.com/production/"
TABLE_NAME = "fox"

# (Key: Value) = (team_name: [connection_id])
TEAMS = {}


def handle_socket(event, _):

    table = boto3.resource('dynamodb').Table(TABLE_NAME)

    route_key = event.get('requestContext', {}).get('routeKey')
    connection_id = event.get('requestContext', {}).get('connectionId')
    team_name = event.get('queryStringParameters', {
                          "team_name": "love"}).get('team_name')
    client = boto3.client('apigatewaymanagementapi', endpoint_url=ENDPOINT)

    if route_key is None or connection_id is None:
        return {'statusCode': 400}

    if route_key == "$connect":
        handle_connect(team_name, connection_id, client, table)

    elif route_key == "$disconnect":
        handle_disconnect(team_name, connection_id, table)

    elif route_key == "send_team":
        handle_send_team(team_name, connection_id,
                         client, json.loads(event["body"]), table)

    return {
        'statusCode': 200
    }


def handle_connect(team_name, connection_id, client, table):

    res = table.get_item(Key={'team_name': team_name})

    # update the team members
    if 'Item' in res:
        members = res['Item']['members'] + [connection_id]
        table.update_item(
            Key={'team_name': team_name},
            UpdateExpression='SET members = :val1',
            ExpressionAttributeValues={
                ':val1': members
            }
        )

    # create new members list
    else:
        table.put_item(Item={'team_name': team_name,
                       "members": [connection_id]})


def handle_disconnect(team_name, connection_id, table):

    res = table.get_item(Key={'team_name': team_name})
    members = res['Item']['members']

    if len(members) != 1:
        table.update_item(
            Key={'team_name': team_name},
            UpdateExpression='SET members = :val1',
            ExpressionAttributeValues={
                ':val1': list(filter(lambda id: id != connection_id, members))
            }
        )
    else:
        table.delete_item(
            Key={'team_name': team_name}
        )


def handle_send_team(team_name, connection_id, client, body, table):
    res = table.get_item(Key={'team_name': team_name})
    members = res['Item']['members']

    for conn_id in members:
        if conn_id != connection_id:
            client.post_to_connection(
                Data=json.dumps({"guess": body["guess"], "response": body["response"]}), ConnectionId=conn_id)
