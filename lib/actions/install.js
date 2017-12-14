const axios = require('axios')
const logger = require('../util/logger')
const to = require('../util/to')
const zip = require('../util/zip')
const path = require('path')
const fs = require('fs')

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

const downloadSource = async (sourceDownloadUrl, zipOutputPath) => {
  const [error, response] = await geTemplateSource(sourceDownloadUrl)

  if (error) {
    throw logger.error('Fail on template download')
  }

  fs.writeFileSync(zipOutputPath, response.data)
}

const install = async (templateName) => {
  const [error, response] = await getSourceList()

  if (error) {
    return logger.error('Error on acess the source list')
  }

  const sourceList = response.data

  const templateToInstall = getTemplateFromSourceList(sourceList, templateName)

  if (!templateToInstall) {
    return logger.error('Invalid template key. Verify and try again')
  }

  const sourceDownloadUrl = buildDownloadUrl(templateToInstall.url)

  const zipOutputPath = path.join(process.cwd(), 'build.zip')

  await downloadSource(sourceDownloadUrl, zipOutputPath)

  const unzipPath = path.join(process.cwd())
  zip.unzip(zipOutputPath, unzipPath)
}

module.exports = install
