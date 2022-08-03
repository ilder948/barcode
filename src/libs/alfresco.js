const config = require("../config/index");
const {
  GroupsApi,
  PeopleApi,
  UploadApi,
  NodesApi,
  SearchApi,
  AuthenticationApi,
} = require("@alfresco/js-api");

var { AlfrescoApi } = require("@alfresco/js-api");

const alfrescoApi = new AlfrescoApi({
  hostEcm: config.ALFRESCO_URL,
  provider: "ALL",
});

let nodeApi = new NodesApi(alfrescoApi);
let authenticationApi = new AuthenticationApi(alfrescoApi);
let uploadApi = new UploadApi(alfrescoApi);

class Alfresco {
  async createFolderByNodeId(nodeId, folderName) {
    return new Promise((resolveProm, rejectProm) => {
      let opts = {
        name: folderName,
        nodeType: "cm:folder",
      };
      nodeApi.createNode(nodeId, opts).then(
        (data) => {
          resolveProm(data);
        },
        (error) => {
          rejectProm(error);
        }
      );
    });
  }

  async CreateToken() {
    return new Promise((resolve, reject) => {
      const userId = "admin";
      const password = "T1g0C0l0mb1420*";
      authenticationApi
        .createTicket({ userId, password })
        .then((data) => {
          console.log(data)
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }


  async validateToken(token) {
    return new Promise((resolve, reject) => {
      authenticationApi.validateTicket(token)
      .then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  async loginTicket(token){
    return new Promise((resolve, reject) =>{
      alfrescoApi.loginTicket(token)
      .then(data => resolve(data))
      .catch(error => reject(error))
    })
  }


  async uploadFile(fileToUpload, directory, rootFolderId, token) {
    return new Promise((resolveProm, rejectProm) => {
      this.loginTicket(token)
      uploadApi.uploadFile(fileToUpload, directory, rootFolderId, {}).then(
        (data) => {
          resolveProm(data);
        },
        (error) => {
          rejectProm(error);
        }
      );
    });
  }
}

module.exports = Alfresco;
