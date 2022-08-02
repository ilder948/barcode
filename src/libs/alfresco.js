const config = require('../config/index')
const { GroupsApi, PeopleApi, UploadApi, NodesApi, SearchApi } = require('@alfresco/js-api');

var {AlfrescoApi} = require("@alfresco/js-api");

const alfrescoApi = new AlfrescoApi({
  hostEcm: config.ALFRESCO_URL,
  provider: "ALL",
});


let nodeApi = new NodesApi(alfrescoApi);

class Alfresco {
  async createFolderByNodeId(nodeId, folderName) {
    return new Promise((resolveProm, rejectProm) => {
      let opts = {
        name: folderName,
        nodeType: "cm:folder"
      };
      nodeApi.createNode(nodeId, opts).then(data => {
        resolveProm(data)
      }, error => {
        rejectProm(error)
      })
    });
  }

  async uploadFile(directory, fileName, fileContent, token, rootFolderId, nodeBody) {
    console.log("CallinguploadFile");
    return new Promise((resolveProm, rejectProm) => {
      var fs = require('fs');
      var dir = './tmp';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
      fs.writeFile(`./tmp/${fileName}`, fileContent, async (err) => {
        if (err) {
          throw err
        }
        let fileToUpload = fs.createReadStream(`./tmp/${fileName}`)
        await this.alfrescoApi.loginTicket(token)
        let uploadApi = new UploadApi(this.alfrescoApi)
        try {
          uploadApi.uploadFile(fileToUpload, directory, rootFolderId, nodeBody).then(data => {
            fs.unlinkSync(`./tmp/${fileName}`);
            resolveProm(data)
          }, error => {
            console.log(error)
            rejectProm(error)
          })

        } catch (err) {
          console.log(error)
          rejectProm(error)
        }

      })
    })
  }
}


module.exports = Alfresco; 
