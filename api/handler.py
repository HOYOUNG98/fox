import json
import random
import datetime
from urllib.parse import urlparse, parse_qs

def guess_color(event, _):

    # Get colors to compare
    color_today = color_of_the_day()
    color_guess = event['queryStringParameters']["guess"]

    # Figure which color is most different
    rgb = ["red", "green", "blue"]
    rgb_range = [(0,2), (2,4), (4,6)]

    max_diff, max_idx = 0, -1
    for idx, (start, end) in enumerate(rgb_range):
        diff = int(color_today[start:end], 16) - int(color_guess[start:end], 16)

        if abs(diff) > abs(max_diff):
            max_diff, max_idx = diff, idx
    

    # Create response data
    more_less = "more" if max_diff > 0 else "less"
    message = "You got it!" if max_idx == -1 else "You need {} {}!".format(more_less, rgb[max_idx])
    
    return {
        "isBase64Encoded": True,
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps(message)
    }


def color_of_the_day():

    now = datetime.datetime.now()
    seed = now.year + now.month + now.day

    random.seed(seed)

    r = lambda: random.randint(0,255)
    return '%02X%02X%02X' % (r(),r(),r())


if __name__=="__main__":
    res = guess_color({"path":"/guess_path?guess=123456"}, {})
    print(res)