function get_map_data(callback, req = {}) {
    const apiUrl = "http://127.0.0.1:5000/map";

    axios
        .get(apiUrl, {
            params: req,
        })
        .then((response) => {
            callback(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
}

function get_chart_data(chart_type, params = {}, callback) {
    const apiUrl =
        "http://127.0.0.1:5000/" + chart_type

    const url = new URL(apiUrl)

    for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, value)
    }
   axios.get(url).then(values => {
        callback(values)
    })
}

function get_circle_bar_data(callback, req = {}) {
    const apiUrl = "http://127.0.0.1:5000/circularBarPlot";

    axios
        .get(apiUrl, {
            params: req,
        })
        .then((response) => {
            callback(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
}


function get_heatmap_data(callback, req = { venueId: 1798, start: "2022-03-01", end: "2022-07-01" }) {
    const apiUrl = "http://127.0.0.1:5000/heatmap";
    axios
        .get(apiUrl, {
            params: req,
        })
        .then((response) => {
            callback(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
}

function get_bar_line(callback, req = { numRecords: "1000", start: "2022-03-01", end: "2022-04-01" }) {

    const apiUrl = "http://127.0.0.1:5000/barLineChart";
    axios
        .get(apiUrl, {
            params: req,
        })
        .then((response) => {
            callback(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
}

function get_stream_data(callback) {
    const apiUrl =
        "http://127.0.0.1:5000/stream"

    axios
        .get(apiUrl, {
            params: {
                average: 'DAILY'
            },
        })
        .then((response) => {
            callback(response);
        })
        .catch((error) => {
            console.error(error);
        });
}

function get_building(callback, venue) {
    const apiUrl = "http://127.0.0.1:5000/buildingId";

    axios
        .get(apiUrl, {
            params: {
                venueId: venue
            },
        })
        .then((response) => {
            callback(response.data.buildingId);
        })
        .catch((error) => {
            console.error(error);
        });
}