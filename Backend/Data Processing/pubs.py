import pandas as pd

# Load Financial Journal and remove duplicates from it
financial_journal_df = pd.read_csv('../Datasets/Journals/FinancialJournal.csv')
financial_journal_df = financial_journal_df.drop_duplicates()

# Load only Recreation data (Because this data is related to Pubs)
recreation_df = financial_journal_df[financial_journal_df['category'] == 'Recreation'] 

# Load Checkin Journal and remove duplicates from it
checkin_journal_df = pd.read_csv('../Datasets/Journals/CheckinJournal.csv')
checkin_journal_df = checkin_journal_df.drop_duplicates()

# Load checkin entries for pubs
pubs_df = checkin_journal_df[checkin_journal_df['venueType'] == 'Pub']

# Get unique participants from financial journal
participants = set(list(recreation_df['participantId']))

# Stores final dataframe
result_df = pd.DataFrame()

# For each participant generate result and concat it to final dataframe
for participant in participants:
    # Load financial data for 1 participant whose participantId is participant
    p_recreation_df = recreation_df[recreation_df['participantId'] == participant].copy()

    # Sort financial data according to timestamp
    p_recreation_df['timestamp'] = pd.to_datetime(p_recreation_df['timestamp'])
    p_recreation_df = p_recreation_df.sort_values(by='timestamp')

    # Create date column in financial data
    p_recreation_df['date'] = pd.to_datetime(p_recreation_df['timestamp']).dt.date

    # Convert amount data to positive in financial data
    p_recreation_df['amount'] = p_recreation_df['amount'].abs()

    # Load checkin data for 1 participant whose participantId is participant
    p_pubs_df = pubs_df[pubs_df['participantId'] == participant].copy()

    # Sort checkin data according to timestamp
    p_pubs_df['timestamp'] = pd.to_datetime(p_pubs_df['timestamp'])
    p_pubs_df = p_pubs_df.sort_values(by='timestamp')

    # Create list of check in time (checkin_time_list), check in venue (buildingId_list), payment time (payment_time_list)
    payment_time_list = list(p_recreation_df['timestamp'])
    checkin_time_list = list(p_pubs_df['timestamp'])
    buildingId_list = list(p_pubs_df['venueId'])

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

    # Add venueId column to financial data.
    p_recreation_df['venueId'] = buildings
    
    # Aggregate amount on participant, date and school buildingId
    aggr_p_recreation_df = p_recreation_df.groupby(['participantId', 'date', 'venueId']).agg({'amount': 'sum'})

    # Merge result of current participant to existing result
    result_df = pd.concat([result_df, aggr_p_recreation_df])

# Add business column to dataframe
result_df['business'] = 'Pub'

# Save aggregated data to csv
result_df.to_csv('Pubs.csv', encoding='utf-8')
