'use strict';

app.controller('AdminCtrl', ['$scope', 'socket', function ($scope, socket) {
    $scope.sendMessage = function (message) {
        socket.emit('mass message', message);
    };

    var crudServiceBaseUrl = "http://localhost:9999/api",
        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "http://localhost:9999/api/users/all",
                    type: 'POST',
                    dataType: "json"
                },
                update: {
                    url: crudServiceBaseUrl + "/users",
                    dataType: "json",
                    type: "PUT"
                },
                destroy: {
                    url: crudServiceBaseUrl + "/users",
                    dataType: "json",
                    type: "DELETE"
                },
                parameterMap: function(data, type) {
                    return data;
                }
            },
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            batch: true,
            pageSize: 5,
            schema: {
                data: 'data',
                total : 'total',
                model: {
                    id: "_id",
                    fields: {
                        id: { editable: false, nullable: false },
                        username: { editable: false, nullable: false },
                        firstName: { type: "string", validation: {required: true}},
                        lastName: { type: "string", validation: {required: true}},
                        experience: { type: "number", validation: {required: true}, min: 0},
                        gold: { type: "number", validation: {required: true, min: 100}},
                        movement: { type: "number", validation: {required: true, min: 0}},
                        coordinates: {
                            x: {type: "number", validation: {require: true, min: 0}},
                            y: {type: "number", validation: {require: true, min: 0}},
                        }
                    }
                }
            }
        });

    $scope.mainGridOptions = {
        dataSource: dataSource,
        filterable: true,
        sortable: true,
        pageable: true,
        columns: [
            { field: "username", title: "Username", width: "100px" },
            { field: "firstName", title: "First Name", width: "100px" },
            { field: "lastName", title: "Last Name", width: "100px" },
            { field: "experience", title: "Experience", width: "100px" },
            { field: "gold", title: "Gold", width: "100px" },
            { field: "movement", title: "Movement", width: "100px" },
            { field: "coordinates.x", title: "X-Coord", width: "100px" },
            { field: "coordinates.y", title: "Y-Coord", width: "100px" },
            { command: ["edit", "destroy"], title: " ", width: "120px" }
        ],
        editable: "popup"
    };
}]);