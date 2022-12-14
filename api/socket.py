import json
import boto3

ENDPOINT = "https://45dl55ctc3.execute-api.us-east-1.amazonaws.com/production/"
TABLE_NAME_TEAMS = "fox-teams"
TABLE_NAME_CONNECTIONS = "fox-connections"

# (Key: Value) = (team_name: [connection_id])
TEAMS = {}


def handle_socket(event, _):

    table_teams = boto3.resource('dynamodb').Table(TABLE_NAME_TEAMS)

    route_key = event.get('requestContext', {}).get('routeKey')
    connection_id = event.get('requestContext', {}).get('connectionId')
    client = boto3.client('apigatewaymanagementapi', endpoint_url=ENDPOINT)

    # Set or fetch team name
    table_connections = boto3.resource(
        'dynamodb').Table(TABLE_NAME_CONNECTIONS)
    team_name = event.get('queryStringParameters', {}).get('team_name')
    if team_name:
        table_connections.put_item(
            Item={'connection_id': connection_id, 'team_name': team_name})
    else:
        res = table_connections.get_item(
            Key={'connection_id': connection_id}
        )
        team_name = res['Item']['team_name']

    if route_key is None or connection_id is None:
        return {'statusCode': 400}

    if route_key == "$connect":
        handle_connect(team_name, connection_id, table_teams)

    elif route_key == "$disconnect":
        handle_disconnect(team_name, connection_id,
                          table_teams, table_connections)

    elif route_key == "send_team":
        handle_send_team(team_name, connection_id, client,
                         json.loads(event["body"]), table_teams)

    return {
        'statusCode': 200
    }


def handle_connect(team_name, connection_id, table):
    # try fetching team_name
    res = table.get_item(Key={'team_name': team_name})
    print(res)

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


def handle_disconnect(team_name, connection_id, table_teams, table_connections):
    res = table_teams.get_item(Key={'team_name': team_name})
    members = res['Item']['members']

    if len(members) != 1:
        table_teams.update_item(
            Key={'team_name': team_name},
            UpdateExpression='SET members = :val1',
            ExpressionAttributeValues={
                ':val1': list(filter(lambda id: id != connection_id, members))
            }
        )
    else:
        table_teams.delete_item(
            Key={'team_name': team_name}
        )

    table_connections.delete_item(
        Key={'connection_id': connection_id}
    )


def handle_send_team(team_name, connection_id, client, body, table):
    res = table.get_item(Key={'team_name': team_name})
    members = res['Item']['members']

    for conn_id in members:
        if conn_id != connection_id:
            client.post_to_connection(
                Data=json.dumps({"guess": body["guess"], "response": body["response"]}), ConnectionId=conn_id)
