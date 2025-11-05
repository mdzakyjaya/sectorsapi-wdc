(function() {
    var myConnector = tableau.makeConnector();

    // Define schema
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

    // Fetch data
    myConnector.getData = function(table, doneCallback) {
        var connData = JSON.parse(tableau.connectionData);
        var apiKey = connData.apiKey;

        $.ajax({
            url: "https://api.sectors.app/v1/subsectors/",
            type: "GET",
            dataType: 'json',
            headers: {
                "Authorization": "Bearer " + apiKey
            },
            success: function(response) {
                var data = response;
                var tableData = [];

                for (var i = 0; i < data.length; i++) {
                    tableData.push({
                        "subsector": data[i].subsector || "",
                        "sector": data[i].sector || "",
                        "description": data[i].description || ""
                    });
                }

                table.appendRows(tableData);
                doneCallback();
            },
            error: function(xhr, status, error) {
                var errMsg = xhr.responseText || error || "Unknown error";
                tableau.abortWithError("API Error: " + errMsg + " (Check API key and network)");
            }
        });
    };

    tableau.registerConnector(myConnector);

    // On button click
    $(document).ready(function() {
        $("#submitButton").click(function() {
            var apiKey = $("#apiKey").val().trim();

            if (!apiKey) {
                alert("Please enter your Sectors.app API key.");
                return;
            }

            tableau.connectionName = "Sectors.app Subsectors";
            tableau.connectionData = JSON.stringify({ apiKey: apiKey });
            tableau.submit();
        });
    });
})();
