# Data Visualization Final Project

## 1. Mini Challenge 3: Economic Issues and Financial Health:
- Dataset: [Vast Challenge 2022 Dataset](https://vast-challenge.github.io/2022/description.html)

## 2. Questions to Answer:
1. Over the period covered by the dataset, which businesses appear to be more prosperous? Which appear to be struggling? Describe your rationale for your answers. Limit your response to 10 images and 500 words.
2. How does the financial health of the residents change over the period covered by the dataset? How do wages compare to the overall cost of living in Engagement? Are there groups that appear to exhibit similar patterns? Describe your rationale for your answers. Limit your response to 10 images and 500 words.
3. Describe the health of the various employers within the city limits. What employment patterns do you observe? Do you notice any areas of particularly high or low turnover? Limit your response to 10 images and 500 words.

## 3. Steps
**Run Backend** 
> Go to directory 'Backend/'Python Scripts'

```
python main.py
```
**Start server in frontend**
> Go to directory 'Frontend'

```
python -m http.server
```
Visit http://localhost:8000 on a browser (preferebly firefox)


## 4. Details on charts implemented
- Map Chart -
The basic map shows which areas of the city are residential and which are commercial. The finance map shows information about income. The income is shown for Pubs,Restaurants and Schools. The intensity of the hue shows how much a business earns. Through this we can see which areas of the map are more profitable than others. Double click on a commercial building, and a heatmap will appear for that business. Selecting venues on the circular chart, zooms and highlights the map in the side panel.

- Circular Bar Chart -
This graph can be described as a radial bar chart that utilizes bars as the primary mark type. Each bar chart represents the revenue generated by three different business categories - schools, restaurants, and pubs - in Engagement, Ohio. The bars are placed radially, with each chart placed one after another. Hovering over any bar displays the specific category and the corresponding amount earned by the business in the center of the chart.

- Density Chart -
We use density chart to show how much a particular degree-holder earns. It shows four different levels of education held by people in the city. The chart is controlled by the input elements, where bandwidth determines the smoothness of the curves whilst the minimum wage filters the data based on the wage of the people. Only those with wages more than the minimum wage input by the user.This chart is independent of the time filter.

- Stream Chart -
The stream chart shows the change in wage vs expenses during the 15 months of data acquisition. It shows the average wage of each person on a daily and monthly basis. The user can switch between monthly average and daily average using the radio buttons provided. This chart also shows the division of expenditure into four categories, shelter, education,recreation and food.

- Line-Bar Chart -
The line bar chart aims to show the average rent per building along with the average wage for jobs which are situated in that particular building.On hovering over the bars, the user can easily see the building id as well as the average wage and the average rent associated with the building.

- Heatmap Chart -
The calendar heatmap shows the day-by-day income of specific schools, pubs and restaurants.They are color coded in such a way that the darker the color the more the income on that day. So, the schools get paid only on the last day of each month. The restaurants have darker colors on weekdays which shows they get more customers on weekdays. Whereas pubs have more business on weekends.


## 5. Members
- Anisha Das
- Roshan Jacob Manoj
- Sanika Yatin Gandhe
- Sanket Surendra Kapse
- Sarthak Singh Chauhan
- Soham Prabhakar Patil

## 6. Addressing the questions?
Using the map chart, we concluded that the businesses operating in the center of the city perform better than businesses which are on the periphery. The map can be used to find areas of affluence in the city and can be used to answer the first question, by changing the time filter according to the needs.The map also helps in showcasing the health of the employers. This can be seen by changing the time filters and seeing the progress of employers.
The Stream chart is very useful for noticing the changes in wages and expenditure during the 15-month time period. We see that people spend most of their money at the end of the month and rent is a large percentage of their average expenditure. The average wage and expenditure of the people seems to be more or less the same during the time, as concluded from the minimal change in width of their particular streams. One more interesting insight gathered from the streams is that the average expenditure of the masses on education is very low. People spend more on recreation than on education. 
The Density chart helps the user gauge an understanding of which education level pays the highest. It also gives the decision makers an understanding of the market requirements in terms of education and can guide them in showing areas which are lacking. Through the minimum wage filter on the density chart we found out that as the minimum wage increases, the jobs for lesser-educated people decrease . A high school degree will get you a maximum of 60 dollars per hour in the city, and jobs paying higher than this threshold strictly require a bachelors or a graduate level of education.  
The Circular-Bar plot is a unique plot , showing the income of businesses with their venue IDs. It helps in finding which particular businesses are performing better as they stand out with higher bars. This is particularly useful in answering the first question posed in the challenge.
The Heatmap chart gives us insight into how the businesses work on a weekly level. On studying the charts, we concluded that restaurants make money throughout the week , whilst pubs mostly make their profits during the weekends. The schools only earn during the first weeks of the month.
The Line-Bar chart is a useful visualization which shows the relationship between a building’s rent and the average wage of the person working there. It gives us an insight into how the employers of those companies pay their employees based on the rent they have to pay. Interestingly, many employers who have to pay high rents pay their employees less money.