const axios = require('axios')
const logger = require('../util/logger')
const to = require('../util/to')
const zipUtil = require('../util/zip')

const getSourceList = () => to(axios('https://cdn.rawgit.com/landfy/landing-pages/c77141b5/sources.json'))

const buildDownloadUrl = baseUrl => `${baseUrl}/archive/master.zip`

const geTemplateSource = url => to(axios.request({
  responseType: 'arraybuffer',
  url,
  method: 'GET',
  headers: {
    'Content-Type': 'application/zip'
  }
}))

const getTemplateFromSourceList = (templateList, templateToInstall) =>
  templateList.find(template => template.key === templateToInstall)

const unzipFile = (zip) => {
  logger.info('Unziping source code')
  const unzipPath = process.cwd()
  try {
    zipUtil.unzip(zip.data, unzipPath)
    logger.succeed(`Done`)
  } catch (error) {
    logger.error(`Ops... ${error.message || error}`)
  }
}

const install = async (templateName) => {
  logger.info('Downloading source list')
  const [sourceListError, response] = await getSourceList()

  if (sourceListError) {
    return logger.error('Error on acess the source list')
  }

  const templateToInstall = getTemplateFromSourceList(response.data, templateName)

  if (!templateToInstall) {
    return logger.error('Invalid template key. Verify and try again')
  }

  logger.info('Downloading source code')
  const [downloadError, zipStream] = await geTemplateSource(buildDownloadUrl(templateToInstall.url))

  if (downloadError) {
    return logger.error('Error on download source, please try again')
  }

  unzipFile(zipStream)
}

module.exports = install
