'use strict';

app.controller('AdminCtrl', ['$scope', 'socket', function ($scope, socket) {
    $scope.sendMessage = function (message) {
        socket.emit('mass message', message);
    };

    var crudServiceBaseUrl = "http://localhost:9999/api",
        dataSource = new kendo.data.DataSource({
            autoSync: true,
            transport: {
                read: {
                    url: crudServiceBaseUrl + "/users",
                    type: 'GET',
                    dataType: "json"
                },
                update: {
                    url: crudServiceBaseUrl + "/users",
                    type: 'PUT',
                    contentType: "application/json",
                    dataType: "json"
                },
                destroy: {
                    url: crudServiceBaseUrl + "/users",
                    type: 'DELETE',
                    contentType: "application/json",
                    dataType: "json"
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options.models) {
                        return {models: kendo.stringify(options.models)};
                    }

                    if (operation == "edit" && options.models) {
                        console.log("Update worked");
                        return { models: kendo.stringify(data.models) };
                    }

                    if (operation == "destroy" && options.models) {
                        console.log("Delete worked");
                        return { models: kendo.stringify(data.models) };
                    }
                }
            },
            batch: true,
            pageSize: 5,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false, nullable: false },
                        username: { editable: false, nullable: false },
                        firstName: { type: "string", validation: {required: true}},
                        lastName: { type: "string", validation: {required: true}},
                        experience: { type: "number", validation: {required: true}, min: 0},
                        gold: { type: "number", validation: {required: true, min: 100}},
                        movement: { type: "number", validation: {required: true, min: 500}}
                    }
                }
            }
        });

    $("#grid").kendoGrid({
        dataSource: dataSource,
        pageable: true,
        columns: [
            { field: "username", title: "Username", width: "100px" },
            { field: "firstName", title: "First Name", width: "100px" },
            { field: "lastName", title: "Last Name", width: "100px" },
            { field: "experience", title: "Experience", width: "100px" },
            { field: "gold", title: "Gold", width: "100px" },
            { field: "movement", title: "Movement", width: "100px" },
            { command: ["edit", "destroy"], title: " ", width: "120px" }
        ],
        editable: "inline"
    });
}]);