/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, {Component} from 'react';
import ListViewParent from '../common/ListViewParent';
import ResourceAPI from '../utils/apis/ResourceAPI';
import Link from '@material-ui/core/Link';
import MUIDataTable from "mui-datatables";

export default class TaskListPage extends Component {
    constructor(props) {
        super(props);
        this.tasks = null;
        this.state = {
            data: [],
            errorOccurred: false
        };
    }

    /**
     * Retrieve tasks from the MI.
     */
    componentDidMount() {
        this.retrieveTasks();
    }

    retrieveTasks() {
        const data = [];

        new ResourceAPI().getResourceList(`/tasks`).then((response) => {
            this.tasks = response.data.list || [];
            this.tasks.forEach((element) => {
                const rowData = [];
                rowData.push(element.name);
                data.push(rowData);
            });
            this.setState({data: data});
            this.setState({errorOccurred: false});
        }).catch((error) => {
            if (error.request) {
                // The request was made but no response was received
                this.setState({errorOccurred: true}, function () {
                    // callback function to ensure state is set immediately
                });
            }
        });
    }

    renderResourceList() {

        const columns = [{
            name: "Task Name",
            options: {
                sortDirection: 'asc',
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Link component="button" variant="body2" onClick={() => {
                            this.props.history.push(`/task/explore?name=${tableMeta.rowData[0]}`)
                        }}>
                            {tableMeta.rowData[0]}
                        </Link>
                    );
                }
            }
        }];
        const options = {
            selectableRows: 'none',
            print: false,
            download: false,
        };

        return (
            <MUIDataTable
                title={"SCHEDULED TASKS"}
                data={this.state.data}
                columns={columns}
                options={options}
                connectionError={this.state.errorOccurred}
            />
        );
    }

    render() {
        return (
            <ListViewParent
                data={this.renderResourceList()}
            />
        );
    }
}
