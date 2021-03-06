const RethinkDbService = require('../services/rethinkdb.service');
import * as types from '../action-types';
import { queryTable } from '../actions';

export function getDbTables(dbConnection, dbName) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      RethinkDbService.getTableList(dbConnection, dbName).then(tables => {
        dispatch({
          type: types.SET_DB_TABLES,
          dbName,
          tables
        });
        resolve(tables);
      }).catch(error => {
        reject(error);
      });
    });
  }
}

export function createTable(dbConnection, dbName, tableName) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      RethinkDbService.createTable(dbConnection, dbName, tableName, 'id').then((results) => {
        dispatch({
          type: types.ADD_TO_TABLE_LIST,
          dbName,
          tableName
        });

        dispatch({
          type: types.TOGGLE_TABLE_FORM,
          showTableForm: false
        });
        resolve(results);
      }).catch(error => {
        dispatch({
          type: 'SET_CONNECTION_LOADING',
          loading: false
        });
        dispatch({
          type: types.SET_TABLE_FORM_ERROR,
          tableFormError: error
        });
        reject(error);
      });
    });
  }
}

export function deleteTable(conn, dbName, tableName) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'SET_CONNECTION_LOADING',
        loading: true
      });
      RethinkDbService.deleteTable(conn, dbName, tableName).then((results) => {
        dispatch({
          type: types.DELETE_TABLE,
          dbName,
          tableName
        });
        dispatch({
          type: 'SET_CONNECTION_LOADING',
          loading: false
        });
        resolve();
      }).catch((err) => {
        dispatch({
          type: "TOGGLE_DELETE_TABLE_FORM",
          showDeleteTableForm: true
        });
        dispatch({
          type: 'SET_CONNECTION_LOADING',
          loading: false
        });
        dispatch({
          type: types.SET_TABLE_FORM_ERROR,
          tableFormError: err
        });
        reject(err);
      });
    });
  }
}
