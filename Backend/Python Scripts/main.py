from flask import Flask, jsonify, request
from flask_cors import CORS

import pandas as pd
from data import *

PAGE_SIZE = 1000

app = Flask(__name__)
CORS(app)


@app.route('/map', methods=['GET'])
def get_map_data():
    start = request.args.get('start', default='', type=str)
    end = request.args.get('end', default='', type=str)
    response = get_map(start, end)
    return jsonify(response)


@app.route('/heatmap', methods=['GET'])
def get_heatmap_data():
    venue_id = request.args.get('venueId', default=1798, type=int)
    start = request.args.get('start', default='2022-03-01', type=str)
    end = request.args.get('end', default='2022-07-01', type=str)
    response = get_heatmap(venue_id, start, end)
    return jsonify(response)


@app.route('/circularBarPlot', methods=['GET'])
def get_circular_bar_plot_data():
    start = request.args.get('start', default='', type=str)
    end = request.args.get('end', default='', type=str)
    response = get_circular_bar(start, end)
    return jsonify(response)


@app.route('/buildingId', methods=['GET'])
def get_building():
    venue_id = request.args.get('venueId', type=int)
    building_id = get_buildingId(venue_id)
    print(building_id)
    response = {"buildingId":int(building_id)}
    return jsonify(response)


@app.route('/pagination_example', methods=['GET'])
def get_pagination_data():
    commercial_data = get_commercial_data()
    commercial_data['date'] = pd.to_datetime(commercial_data['date'])

    min_date = commercial_data['date'].min()
    max_date = commercial_data['date'].max()

    min_date_str = str(min_date.date())
    max_date_str = str(max_date.date())

    start = request.args.get('start', default=min_date_str, type=str)
    end = request.args.get('end', default=max_date_str, type=str)

    start_date = pd.to_datetime(start)
    end_date = pd.to_datetime(end)

    filtered_df = commercial_data[(commercial_data['date'] >= start_date) & (
        commercial_data['date'] <= end_date)]

    page = request.args.get('page', default=1, type=int)

    pagination, page_data = get_paginaion(filtered_df, page)

    response = {
        'data': page_data,
        'pagination': pagination
    }

    return jsonify(response)


@app.route('/stream', methods=['GET'])
def get_stream_data():
    start_date = request.args.get('start_date', type=str)
    end_date = request.args.get('end_date', type=str)
    average = request.args.get('average', type=str)
    params = {
        'start_date': start_date if start_date != None else '2022-03-01',
        'end_date': end_date if end_date != None else '2023-05-24',
        'average': average if average != None else 'DAILY'
    }
    return jsonify(get_stream(params))


@app.route('/densityPlot', methods=['GET'])
def density_plot_data():
    min_wage = request.args.get('min_wage', default=5.0, type=float)
    return jsonify(get_density_chart(min_wage))


@app.route('/barLineChart', methods=['GET'])
def get_bar_line_chart_data():
    start = request.args.get('start', default='', type=str)
    end = request.args.get('end', default='', type=str)
    numRecords = request.args.get('numRecords', default='', type=str)
    response = get_bar_line(start, end, numRecords)
    return jsonify(response)


if __name__ == '__main__':
    app.run()
