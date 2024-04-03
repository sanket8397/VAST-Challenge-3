import pandas as pd
def get_venueId_buildingId_pubs():
    pubs = pd.read_csv('../Data/Attributes/Pubs.csv')
    pubs = pubs.rename(columns={'pubId': 'venueId'})
    df = pubs[['venueId', 'buildingId']]
    return df

def get_venueId_buildingId_restaurants():
    restaurants = pd.read_csv('../Data/Attributes/Restaurants.csv')
    restaurants = restaurants.rename(columns={'restaurantId': 'venueId'})
    df = restaurants[['venueId', 'buildingId']]
    return df

def get_venueId_buildingId_schools():
    schools = pd.read_csv('../Data/Attributes/Schools.csv')
    schools = schools.rename(columns={'schoolId': 'venueId'})
    df =  schools[['venueId', 'buildingId']]
    return df

schools = get_venueId_buildingId_schools()
pubs = get_venueId_buildingId_pubs()
restaurants = get_venueId_buildingId_restaurants()

venueId_buildingId_map = pd.concat([schools, pubs, restaurants], ignore_index=True)

venueId_buildingId_map.to_csv('../Data/venueId_buildingId_map.csv', index=False)

