const axios = require('axios')
const logger = require('../util/logger')
const to = require('../util/to')
const zip = require('../util/zip')
const path = require('path')

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

const getTemplateFromSourceList = (templateList, templateToInstall) => templateList.find(template => template.key === templateToInstall)

const install = async (templateName) => {
  logger.info('Downloading source list')
  const [sourceListError, response] = await getSourceList()

  if (sourceListError) {
    return logger.error('Error on acess the source list')
  }

  const sourceList = response.data

  const templateToInstall = getTemplateFromSourceList(sourceList, templateName)

  if (!templateToInstall) {
    return logger.error('Invalid template key. Verify and try again')
  }

  logger.info('Downloading source code')
  const sourceDownloadUrl = buildDownloadUrl(templateToInstall.url)

  const [downloadError, zipStream] = await geTemplateSource(sourceDownloadUrl)

  if (downloadError) {
    return logger.error('Error on download source, please try again')
  }

  logger.info('Unziping source code')
  const unzipPath = path.join(process.cwd())

  try {
    zip.unzip(zipStream.data, unzipPath)
    logger.succeed(`Done`)
  } catch (error) {
    logger.error(`Ops... ${error.message || error}`)
  }
}

module.exports = install
