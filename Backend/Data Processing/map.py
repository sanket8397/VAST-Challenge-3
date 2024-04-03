import csv
import json

# open the csv file and read the data
ids = []
with open('../Datasets/Attributes/Buildings.csv', 'r') as csv_file:
    csv_reader = csv.reader(csv_file)
    # skip the header row
    next(csv_reader)
    
    # create a list to store the features
    features = []
    
    # loop through each row and create a feature for each polygon
    for row in csv_reader:
        rings = row[1].split('), (')
        coords = []
        for ring in rings:
            a = []
            coords_str = ring.replace('POLYGON', '').replace('(', '').replace(')', '').split(',')
            a.append([[float(c.split()[0]), float(c.split()[1])] for c in coords_str])
            coords.append(a)
        final = []
        for t in coords:
            final.append(t[0])

        # create the feature object
        feature = {
            'type': 'Feature',
            'properties': {
                'type': row[2],
                'id': row[0]
            },
            'geometry': {
                'type': 'Polygon',
                'coordinates': final
            }
        }
        features.append(feature)
    
    # create the GeoJSON object
    geojson_obj = {
        'type': 'FeatureCollection',
        'features': features
    }
    # print(ids)
    # write the GeoJSON object to a file
    with open('data.geojson', 'w') as geojson_file:
        json.dump(geojson_obj, geojson_file)
