import {
  DEVICE_GET_TREE,
  DEVICE_GET_INFO,
  DEVICE_ADD_UNDER,
  DEVICE_CHANGE_NAME,
  DEVICE_DEL
} from '../constants/DeviceConstants.js';
import {LOGOUT_USER} from '../constants/LoginConstants.js';
import BaseStore from './BaseStore';

class DeviceTreeStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._deviceTree = null;
  }

  _registerToActions(action) {
    switch(action.actionType) {
    case DEVICE_GET_TREE:
      this._deviceTree = action.deviceTree;
      this.emitChange();
      break;
    case DEVICE_ADD_UNDER:
      this._addUnder(action.parentId, this._deviceTree);
      this.emitChange();
      break;
    case DEVICE_CHANGE_NAME:
      this._changeName(action.id, action.text, this._deviceTree);
      this.emitChange();
      break;
    case DEVICE_DEL:
      this._delete(action.id, this._deviceTree);
      this.emitChange();
      break;
    case LOGOUT_USER:
      this._deviceTree = null;
      this.emitChange();
      break;
    default:
      break;
    };
  }
  
  get deviceTree() {
    return this._deviceTree;
  }

  _addUnder(parentId, devices) {
    for(var d of devices) {
      if(d.id === parentId) {
        var tempNode = {id: `null-${new Date().valueOf()}`, text: "undefine"};
        if(d.nodes) {
          d.nodes.push(tempNode);
        } else {
          d.nodes = [tempNode];
        }
        break;
      } else {
        if(d.nodes) {
          this._addUnder(parentId, d.nodes);
        }
      }
    }
  }

  _changeName(id, text, devices) {
    for(var d of devices) {
      if(d.id === id) {
        d.text = text;
        return;
      }
      if(d.nodes) {
        this._changeName(id, text, d.nodes);
      }
    }
  }

  _delete(id, devices) {
    var idx = 0;
    for(; idx < devices.length; ++idx) {
      if(devices[idx].id === id) {
        devices.splice(idx, 1);
        return;
      }
      if(devices[idx].nodes) {
        this._delete(id, devices[idx].nodes);
      }
    }
  }
}

export default new DeviceTreeStore();
