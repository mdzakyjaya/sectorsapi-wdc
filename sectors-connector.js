(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema (the columns Tableau will see)
    myConnector.getSchema = function(schemaCallback) {
        var cols = [
            { id: "subsector", alias: "Subsector", dataType: tableau.dataTypeEnum.string },
            { id: "sector", alias: "Sector", dataType: tableau.dataTypeEnum.string },
            { id: "description", alias: "Description", dataType: tableau.dataTypeEnum.string }
        ];

        var tableSchema = {
            id: "sectors_subsectors",
            alias: "Sectors.app Subsectors",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        var apiKey = "21217cdb0e5128de3b4ccfac0a112b221b95557ac7748144cb82ca54cb053580"; // IMPORTANT: Replace with your actual key

        var apiCall = $.ajax({
            url: "https://sectors.app/api/subsectors/",
            type: "GET",
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
            }
        });

        apiCall.done(function(response) {
            var data = response; // The API returns an array of objects
            var tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = data.length; i < len; i++) {
                tableData.push({
                    "subsector": data[i]["subsector"],
                    "sector": data[i]["sector"],
                    "description": data[i]["description"]
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });

        apiCall.fail(function(xhr, textStatus, errorThrown) {
            tableau.abortWithError("Could not load data from Sectors.app API. Check your API key and network connection. Error: " + errorThrown);
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listener for when the user submits the button
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Sectors.app Data";
            tableau.submit();
        });
    });
})();