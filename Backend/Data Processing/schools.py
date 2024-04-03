import pandas as pd

# Load School Data and save it as list of dictories  
schools_df = pd.read_csv('../Datasets/Attributes/Schools.csv')
schools_df = schools_df.drop_duplicates()
schools = schools_df.to_dict('records')


financial_journal_df = pd.read_csv('../Datasets/Journals/FinancialJournal.csv')
financial_journal_df = financial_journal_df.drop_duplicates()
financial_journal_df['date'] = pd.to_datetime(financial_journal_df['timestamp']).dt.date


education_df = financial_journal_df[financial_journal_df['category'] == 'Education'].copy()

# education_df.to_csv('Education.csv', encoding='utf-8', index=False)
# education_df = pd.read_csv('Education.csv')

education_df = education_df.drop_duplicates()
education_df['amount'] = education_df['amount'].abs()

def get_school_building(amount):
    for school in schools:
        if amount // 10 == school['monthlyCost'] // 10:
            return school['buildingId']

education_df['buildingId'] = education_df['amount'].apply(get_school_building)
education_df = education_df.drop(columns=['timestamp', 'category'])

aggr_education_df = education_df.groupby(['participantId', 'date', 'buildingId']).agg({'amount': 'sum'})
aggr_education_df['business'] = 'School'

aggr_education_df.to_csv('Schools.csv', encoding='utf-8')

