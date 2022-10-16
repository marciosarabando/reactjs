import React from "react";
var createReactClass = require('create-react-class');
import PropTypes from 'prop-types'

var Excel = createReactClass({
    displayName: 'Excel',
    
    propTypes: {
        headers: PropTypes.arrayOf(
          PropTypes.string
        ),
        initialData: PropTypes.arrayOf(
          PropTypes.arrayOf(
            PropTypes.string
          )
        ),
      },

    getInitialState: function() {
        return {
            data: this.props.initialData,
            sortby: null,
            descending: false,
            edit: null, // [row index, cell index],
            search: false,
        };
    },
    _log: [],

    componentWillMount: function(){
        //console.log(this.state.data);
    },

    _replay: function(){
        if(this._log.length === 0){
            console.warn('No state to replay yet');
            return;
        }
        var idx = -1;
        var interval = setInterval(function(){
            idx++;
            if(idx === this._log.length - 1){ //fim
                clearInterval(interval);
            }
            this.setState(this._log[idx]);
        }.bind(this), 1000);
    },

    componentDidMount: function(){
        document.onkeydown = function(e){
            if(e.ctrlKey && e.shiftKey && e.keyCode === 82){
                this._replay();
            }
        }.bind(this);
    },

    _sort: function(e){
        var data = this.state.data.slice();
        var column = e.target.cellIndex;
        var descending = this.state.sortby === column && !this.state.isDescending;

        console.log(descending);

        data.sort(function(a, b){
            return descending ? a[column] < b[column] ? 1 : -1
                              : a[column] > b[column] ? 1 : -1;
        });

        this._logSetState({
            data: data,
            sortby: column,
            isDescending: descending
        });
    },

    _showEditor: function(e){
        this._logSetState({
            edit: {
                row: parseInt(e.target.dataset.row, 10),
                cell: e.target.cellIndex,
            }
        });
    },

    _save: function(e){
        e.preventDefault();
        console.log('salvando...');

        var input = e.target.firstChild;

        var data = this.state.data.slice();

        data[this.state.edit.row][this.state.edit.cell] = input.value;

        this._logSetState({
            edit: null,
            data: data
        });
    },

    _logSetState: function(newState){
        this._log.push(JSON.parse(JSON.stringify(
            this._log.length === 0 ? this.state : newState
        )));
        console.log(this._log);
        this.setState(newState);
    },

    _renderTable: function(){
        return (
            <table>
                <thead onClick={this._sort}>
                    <tr>
                        {
                            this.props.headers.map(function(title, idx){
                                if(this.state.sortby === idx){
                                    title += this.state.isDescending ? ' \u2191' : ' \u2193'
                                }
                                return <th key={idx}>{title}</th>
                            }, this)
                         }
                    </tr>
                </thead>
                <tbody onDoubleClick={this._showEditor}>
                    {this._renderSearch()}
                    {
                        this.state.data.map(function(row, rowidx){
                            return(
                                <tr key={rowidx}>
                                    {
                                        row.map(function(cell, cellidx){
                                            var content = cell;
                                            var edit = this.state.edit;
                                            if (edit && edit.row === rowidx && edit.cell === cellidx) {
                                                content = (
                                                    <form onSubmit={this._save}>
                                                        <input type="text" defaultValue={cell} />
                                                    </form>
                                                );
                                            }
                                            return <td key={cellidx} data-row={rowidx}>{content}</td>
                                        }, this)
                                    }
                                </tr>
                            );
                        }, this)
                    }
                </tbody>    
            </table>
        )
    },

    _toggleSearch: function(){
        if(this.state.search) {
            this._logSetState({ 
                data: this._preSearchData,
                search: false,
            });
            this._preSearchData = null;
        }
        else{
            this._preSearchData = this.state.data;
            this._logSetState({ search: true });
        }
    },

    _download: function(format, ev){
        console.log(format);
        var contents = format === 'json' ? JSON.stringify(this.state.data)
            : this.state.data.reduce(function(result, row){
                return result 
                    + row.reduce(function (rowresult, cell, idx){
                    return rowresult
                    + '"'
                    + cell.replace(/"/g, '""')
                    + '"'
                    + (idx < row.length - 1 ? ',' : '');
                }, '')
                + "\n";
            }, '');
        console.log(contents);
        //Create a Blob from data
        const file = new Blob(
            [contents], 
            {type: 'text/' + format});

        const url = window.URL.createObjectURL(file);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
            "download",
            `teste.` + format
        );
        document.body.appendChild(link);
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
    },

    _renderToolbar: function(){
        return(
            <div className="div-toolbar">
                <button className="toolbar" onClick={this._toggleSearch}>Search</button>
                <button className="toolbar" onClick={this._download.bind(this,'json')}>Export Json</button>
                <button className="toolbar" onClick={this._download.bind(this,'csv')}>Export CSV</button>
            </div>
        );
    },

    _renderSearch: function() {
        if(!this.state.search){
            return null;
        }

        return(
            <tr onChange={this._search}>
                {this.props.headers.map(function(_ignore, idx){
                    return <td key={idx}><input type='text' data-idx={idx}></input></td>
                })}
            </tr>
        );
    },

    _search: function(e){
        //Coluna a ser pesquisada
        var idx = e.target.dataset.idx;
        
        //texto digitado
        var needle = e.target.value.toLowerCase();
        
        if(!needle){
            this._logSetState({
                data: this._preSearchData
            });
            return;
        }

        var searchdata = this._preSearchData.filter(function(row){
            return row[idx].toString().toLowerCase().indexOf(needle) > -1;
        });
        this._logSetState({ data: searchdata });
    },

    render: function(){
        return (
            <div className="Excel">
                {this._renderToolbar()}
                {this._renderTable()}
            </div>
        );
    }

});

export default Excel