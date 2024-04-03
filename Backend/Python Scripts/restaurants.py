import pandas as pd

# Load Financial Journal and remove duplicates from it
financial_journal_df = pd.read_csv('../Datasets/Journals/FinancialJournal.csv')
financial_journal_df = financial_journal_df.drop_duplicates()

# Load only Food data (Because this data is related to Restaurants)
food_df = financial_journal_df[financial_journal_df['category'] == 'Food'] 

# Load Checkin Journal and remove duplicates from it
checkin_journal_df = pd.read_csv('../Datasets/Journals/CheckinJournal.csv')
checkin_journal_df = checkin_journal_df.drop_duplicates()

# Load checkin entries for Restaurant
restaurants_df = checkin_journal_df[checkin_journal_df['venueType'] == 'Restaurant']

# Get unique participants from financial journal
participants = set(list(food_df['participantId']))

# Stores final dataframe
result_df = pd.DataFrame()

# For each participant generate result and concat it to final dataframe
for participant in participants:
    # Load financial data for 1 participant whose participantId is participant
    p_food_df = food_df[food_df['participantId'] == participant].copy()

    # Sort financial data according to timestamp
    p_food_df['timestamp'] = pd.to_datetime(p_food_df['timestamp'])
    p_food_df = p_food_df.sort_values(by='timestamp')

    # Create date column in financial data
    p_food_df['date'] = pd.to_datetime(p_food_df['timestamp']).dt.date

    # Convert amount data to positive in financial data
    p_food_df['amount'] = p_food_df['amount'].abs()

    # Load checkin data for 1 participant whose participantId is participant
    p_restaurants_df = restaurants_df[restaurants_df['participantId'] == participant].copy()

    # Sort checkin data according to timestamp
    p_restaurants_df['timestamp'] = pd.to_datetime(p_restaurants_df['timestamp'])
    p_restaurants_df = p_restaurants_df.sort_values(by='timestamp')

    # Create list of check in time (checkin_time_list), check in venue (buildingId_list), payment time (payment_time_list)
    payment_time_list = list(p_food_df['timestamp'])
    checkin_time_list = list(p_restaurants_df['timestamp'])
    buildingId_list = list(p_restaurants_df['venueId'])

    # buildingIds corresponding to payment time
    buildings = []
    j = 0
    # For each payment time, find maximum check in time which is less than payment time
    # Add venueId corresponding to that checkIn time to buildings list
    for i, payment_time in enumerate(payment_time_list):
        while j < len(checkin_time_list) - 1 and payment_time > checkin_time_list[j+1]:
            j += 1
        if payment_time > checkin_time_list[j]:
            buildings.append(buildingId_list[j])
        else:
            buildings.append(None)
    
    # Add buildingId column to financial data.
    p_food_df['buildingId'] = buildings

    # Aggregate amount on participant, date and school buildingId
    aggr_p_food_df = p_food_df.groupby(['participantId', 'date', 'buildingId']).agg({'amount': 'sum'})

    # Merge result of current participant to existing result
    result_df = pd.concat([result_df, aggr_p_food_df])

# Add business column to dataframe
result_df['business'] = 'Restaurant'

# Save aggregated data to csv
result_df.to_csv('Restaurants.csv', encoding='utf-8')

result_df = pd.read_csv('Restaurants.csv')

# Convert buildingId to integer
result_df['buildingId'] = result_df['buildingId'].astype('int')

result_df.to_csv('Restaurants.csv', encoding='utf-8')
