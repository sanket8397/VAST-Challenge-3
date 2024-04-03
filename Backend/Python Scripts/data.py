import pandas as pd
import json
from datetime import datetime

PAGE_SIZE = 1000


def get_pubs():
    pubs = pd.read_csv('../Data/Pubs.csv')
    return pubs


def get_restaurants():
    restaurants = pd.read_csv('../Data/Restaurants.csv')
    return restaurants


def get_schools():
    schools = pd.read_csv('../Data/Schools.csv')
    return schools


def get_attributes_pubs():
    pubs = pd.read_csv('../Data/Attributes/Pubs.csv')
    return pubs


def get_attributes_restaurants():
    restaurants = pd.read_csv('../Data/Attributes/Restaurants.csv')
    return restaurants


def get_attributes_schools():
    schools = pd.read_csv('../Data/Attributes/Schools.csv')
    return schools

def get_venueId_buidlingId_map():
    venueId_buidlingId_map = pd.read_csv('../Data/venueId_buildingId_map.csv')
    return venueId_buidlingId_map

# filter data


def get_commercial_data(start='', end=''):
    pubs = get_pubs()
    schools = get_schools()
    restaurants = get_restaurants()

    commercial_data = pd.concat([pubs, restaurants, schools])
    commercial_data['date'] = pd.to_datetime(commercial_data['date'])

    min_date = commercial_data['date'].min()
    max_date = commercial_data['date'].max()

    if start == '':
        start = str(min_date.date())
    if end == '':
        end = str(max_date.date())

    start_date = pd.to_datetime(start)
    end_date = pd.to_datetime(end)

    filtered_df = commercial_data[(commercial_data['date'] >= start_date) & (
        commercial_data['date'] <= end_date)]

    return filtered_df


def get_paginaion(data, page):
    start_index = (page - 1) * PAGE_SIZE
    end_index = start_index + PAGE_SIZE
    page_data = data.iloc[start_index:end_index]
    page_data_dict = page_data.to_dict(orient='records')

    total_rows = len(data)

    total_pages = int(total_rows / PAGE_SIZE) + (total_rows % PAGE_SIZE > 0)

    pagination = {
        'total_rows': total_rows,
        'total_pages': total_pages,
        'current_page': page,
        'page_size': PAGE_SIZE
    }

    return pagination, page_data_dict


def venue_id_to_buidling_id():
    pubs = get_attributes_pubs()
    schools = get_attributes_schools()
    restaurants = get_attributes_restaurants()
    pubs.rename(columns={'pubId': 'id'}, inplace=True)
    schools.rename(columns={'schoolId': 'id'}, inplace=True)
    restaurants.rename(columns={'restaurantId': 'id'}, inplace=True)
    mapping = pd.concat([pubs[['id', 'buildingId']], restaurants[[
                        'id', 'buildingId']], schools[['id', 'buildingId']]])
    venue_to_building = dict(zip(mapping['id'], mapping['buildingId']))
    return venue_to_building


def building_id_to_venue_id():
    pubs = get_attributes_pubs()
    schools = get_attributes_schools()
    restaurants = get_attributes_restaurants()
    pubs.rename(columns={'pubId': 'id'}, inplace=True)
    schools.rename(columns={'schoolId': 'id'}, inplace=True)
    restaurants.rename(columns={'restaurantId': 'id'}, inplace=True)
    mapping = pd.concat([pubs[['id', 'buildingId']], restaurants[[
                        'id', 'buildingId']], schools[['id', 'buildingId']]])
    building_to_venue = dict(zip(mapping['buildingId'], mapping['id']))
    return building_to_venue


def get_building_id(venue_id):
    building_to_venue = building_id_to_venue_id()
    return building_to_venue[venue_id]


def get_map(start='', end=''):
    map_json = open('../Data/map.geojson')
    map_data = json.load(map_json)
    features = map_data['features']
    commercial_data_temp = get_commercial_data(start, end)
    # Aggregate amount on venueId and business
    commercial_data = commercial_data_temp.groupby(
        ['business', 'venueId']).agg({'amount': 'sum'})
    commercial_data = commercial_data.reset_index()
    # print(commercial_data)
    venue_to_building = venue_id_to_buidling_id()
    commercial_data['buildingId'] = commercial_data['venueId'].map(
        venue_to_building)
    for feature in features:
        properties = feature['properties']
        if properties['type'] == 'Commercial':
            business = commercial_data.loc[commercial_data['buildingId'] == int(
                properties['id'])]
            if business.empty:
                properties['business_type'] = 'NotDefined'
            else:
                # print(business.iloc[0]['venueId'])
                properties['id'] = str(business.iloc[0]['buildingId'])
                properties['business_type'] = business.iloc[0]['business']
                properties['income'] = business.iloc[0]['amount']
        elif properties['type'] == 'School':
            properties['business_type'] = 'School'
            school = commercial_data.loc[commercial_data['venueId'] == int(
                properties['id'])]
            properties['income'] = school.iloc[0]['amount']
        else:
            properties['income'] = 0
    # print(map_data)
    return map_data


def get_heatmap(venue_id, start='', end=''):
    # print(venue_id)
    commercial_data_temp = get_commercial_data(start, end)
    commercial_data = commercial_data_temp.groupby(
        ['date', 'business', 'venueId']).agg({'amount': 'sum'})
    commercial_data = commercial_data.reset_index()
    mask = commercial_data['business'] == 'School'
    commercial_data.loc[mask, 'venueId'] = commercial_data.loc[mask, 'venueId'].apply(
        get_building_id)
    commercial_data_filtered = commercial_data[(
        commercial_data['venueId'] == venue_id)]
    commercial_data_dict = commercial_data_filtered.to_dict(orient='records')
    return commercial_data_dict


def get_circular_bar(start='', end=''):
    commercial_data_temp = get_commercial_data(start, end)
    commercial_data = commercial_data_temp.groupby(
        ['business', 'venueId']).agg({'amount': 'sum'})
    commercial_data = commercial_data.reset_index()
    mask = commercial_data['business'] == 'School'
    commercial_data.loc[mask, 'venueId'] = commercial_data.loc[mask, 'venueId'].apply(
        get_building_id)
    commercial_data_dict = commercial_data.to_dict(orient='records')
    return commercial_data_dict

def get_buildingId(venudId):
    mapping = get_venueId_buidlingId_map()
    return mapping.loc[mapping['venueId'] == int(venudId), 'buildingId'].iloc[0]

def get_wage():
    wage = pd.read_csv('../Data/Wage.csv')
    return wage


def get_costs():
    costs = pd.read_csv('../Data/Costs.csv')
    return costs


def get_df_daily(type, number_of_people, base_df):
    costs_average = base_df.groupby(['timestamp']).agg({'amount': 'sum'})
    costs_average[f'{type}'] = -costs_average['amount']/number_of_people
    # print(costs_average)
    costs_average = costs_average.reset_index()
    costs_average['timestamp'] = costs_average['timestamp'].dt.date
    costs_average = costs_average[['timestamp', f'{type}']]
    return costs_average


def get_df_monthly(type, number_of_people, base_df):
    df = base_df.groupby(base_df['timestamp'].dt.year.apply(
        str) + "/" + base_df['timestamp'].dt.month.apply(str)+"/01").agg({'amount': 'sum'})
    df[f'{type}'] = -df['amount']/number_of_people

    df = df.reset_index()

    df['timestamp'] = pd.to_datetime(df['timestamp'])

    df = df[['timestamp', f'{type}']]
    return df


def get_stream(params):
    number_of_people = 1010
    wage = get_wage()
    costs = get_costs()

    wage = wage.loc[(wage['timestamp'] >= params['start_date'])
                    & (wage['timestamp'] <= params['end_date'])]
    costs = costs.loc[(costs['timestamp'] >= params['start_date']) & (
        costs['timestamp'] <= params['end_date'])]

    wage['timestamp'] = pd.to_datetime(wage['timestamp'])

    costs['timestamp'] = pd.to_datetime(costs['timestamp'])

    if params['average'] == 'DAILY':
        wage_average = get_df_daily('wage', number_of_people, wage)
        wage_average['wage'] = -wage_average['wage']
        costs_average = get_df_daily(
            'cost', number_of_people=number_of_people, base_df=costs)

        education_average = get_df_daily(
            'education', number_of_people, base_df=costs.loc[costs['category'] == 'Education'])
        food_average = get_df_daily(
            'food', number_of_people, base_df=costs.loc[costs['category'] == 'Food'])
        recreation_average = get_df_daily(
            'recreation', number_of_people, base_df=costs.loc[costs['category'] == 'Recreation'])
        shelter_average = get_df_daily(
            'shelter', number_of_people, base_df=costs.loc[costs['category'] == 'Shelter'])

        costs_average = costs_average.merge(
            education_average, how='left', on="timestamp").sort_values('timestamp')
        costs_average = costs_average.merge(
            food_average, how='left', on="timestamp").sort_values('timestamp')
        costs_average = costs_average.merge(
            recreation_average, how='left', on="timestamp").sort_values('timestamp')
        costs_average = costs_average.merge(
            shelter_average, how='left', on="timestamp").sort_values('timestamp')

        costs_average = costs_average.fillna(0)

        costs_average['cost'] = costs_average['education'] + costs_average['food'] + \
            costs_average['recreation'] + costs_average['shelter']

    else:
        wage_average = get_df_monthly('wage', number_of_people, wage)
        wage_average['wage'] = -wage_average['wage']

        costs_average = get_df_monthly(
            'cost', number_of_people=number_of_people, base_df=costs)
        # print(costs_average)

        education_average = get_df_monthly(
            'education', number_of_people, base_df=costs.loc[costs['category'] == 'Education'])
        food_average = get_df_monthly(
            'food', number_of_people, base_df=costs.loc[costs['category'] == 'Food'])
        recreation_average = get_df_monthly(
            'recreation', number_of_people, base_df=costs.loc[costs['category'] == 'Recreation'])
        shelter_average = get_df_monthly(
            'shelter', number_of_people, base_df=costs.loc[costs['category'] == 'Shelter'])

        costs_average = costs_average.merge(
            education_average, how='left', on="timestamp").sort_values('timestamp')
        costs_average = costs_average.merge(
            food_average, how='left', on="timestamp").sort_values('timestamp')
        costs_average = costs_average.merge(
            recreation_average, how='left', on="timestamp").sort_values('timestamp')
        costs_average = costs_average.merge(
            shelter_average, how='left', on="timestamp").sort_values('timestamp')

        costs_average = costs_average.fillna(0)

        costs_average['cost'] = costs_average['education'] + costs_average['food'] + \
            costs_average['recreation'] + costs_average['shelter']

    merged = wage_average.merge(
        costs_average, on="timestamp").sort_values('timestamp')
    merged = merged.rename(columns={'amount_x': 'wage', 'amount_y': 'cost'})
    return {
        'data': merged.to_dict('records')
    }


def get_density_chart(min_wage):
    jobs_df = pd.read_csv('../Data/Jobs.csv')
    # print(jobs_df)
    jobs_df = jobs_df.drop_duplicates()
    jobs_df = jobs_df.loc[jobs_df['hourlyRate'] >= min_wage]
    return jobs_df.to_dict(orient='records')


def get_bar_line(start='', end='', numRecords='100'):

    bar_line = pd.read_csv('../Data/BarLine.csv', nrows = int(numRecords))
    bar_line['timestamp'] = bar_line['timestamp'].astype(str)

    for i, row in bar_line.iterrows():
        try:
            # Parse the date string using the datetime.strptime() function
            date = datetime.strptime(row['timestamp'], '%Y-%m-%d')
        except ValueError:
            # Print the row index and the invalid date string
            print(f"Error in row {i}: {row['timestamp']}")

    # print("Datatype : ", bar_line['timestamp'].dtype)
    bar_line['date'] = pd.to_datetime(bar_line['timestamp'])

    min_date = bar_line['date'].min()
    max_date = bar_line['date'].max()

    if start == '':
        start = str(min_date.date())
    if end == '':
        end = str(max_date.date())

    start_date = pd.to_datetime(start)
    end_date = pd.to_datetime(end)

    filtered_df = bar_line[(bar_line['date'] >= start_date)
                           & (bar_line['date'] <= end_date)]

    bar_line_data_dict = filtered_df.to_dict(orient='records')
    return bar_line_data_dict
