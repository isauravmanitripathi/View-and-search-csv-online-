var CSVFileViewerOnline = CSVFileViewerOnline || {};

CSVFileViewerOnline = {
    init: function (options) {
        options = options || {};
        var PathOfCsvFile = options.PathOfCsvFile || "";
        var el = options.element || "table-container";

        var AvailableCsvOptions = options.AvailableCsvOptions || {};
        var CsvDatabaseOptions = options.CsvDatabaseOptions || {};
        var CSVFileFormatting = options.CSVFileFormatting || [];
        var CSVTemporaryTemplates = {};
        $.each(CSVFileFormatting, function (i, v) {
            var CsvColumnIdX = v[0];
            var func = v[1];
            CSVTemporaryTemplates[CsvColumnIdX] = func;
        });

        var CsvDataInTable = $("<table class='table table-striped table-condensed' id='" + el + "-table'></table>");
        var CSVContainerElement = $("#" + el);
        CSVContainerElement.empty().append(CsvDataInTable);

        $.when($.get(PathOfCsvFile)).then(
            function (data) {
                var csvData = $.csv.toArrays(data, AvailableCsvOptions);
                var CsvDataInTableHead = $("<thead></thead>");
                var csvHeaderRow = csvData[0];
                var CsvDataInTableHeadRow = $("<tr></tr>");
                try {
                    for (var CSVHeaderId = 0; CSVHeaderId < csvHeaderRow.length; CSVHeaderId++) {
                        CsvDataInTableHeadRow.append($("<th></th>").text(csvHeaderRow[CSVHeaderId]));
                    }
                    CsvDataInTableHead.append(CsvDataInTableHeadRow);
                } catch (e) {
                }

                CsvDataInTable.append(CsvDataInTableHead);
                var CsvDataInTableBody = $("<tbody></tbody>");

                for (var CSVROwIdX = 1; CSVROwIdX < csvData.length; CSVROwIdX++) {
                    var CsvDataInTableBodyRow = $("<tr></tr>");
                    for (var CsvColumnIdX = 0; CsvColumnIdX < csvData[CSVROwIdX].length; CsvColumnIdX++) {
                        var CsvDataInTableBodyRowTd = $("<td></td>");
                        var cellTemplateFunc = CSVTemporaryTemplates[CsvColumnIdX];
                        try {
                            if (!cellTemplateFunc) {
                                CsvDataInTableBodyRowTd.text(csvData[CSVROwIdX][CsvColumnIdX]);
                            } else {
                                CsvDataInTableBodyRowTd.html(cellTemplateFunc(csvData[CSVROwIdX][CsvColumnIdX]));
                            }
                        } catch (e) {
                        }
                        CsvDataInTableBodyRow.append(CsvDataInTableBodyRowTd);
                        CsvDataInTableBody.append(CsvDataInTableBodyRow);
                    }
                }
                CsvDataInTable.append(CsvDataInTableBody);

                CsvDataInTable.DataTable(CsvDatabaseOptions);


            });
    }
};
