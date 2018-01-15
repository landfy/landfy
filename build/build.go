package build

import (
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/Jeffail/gabs"
	"github.com/landfy/landfy/util"
	"github.com/urfave/cli"
)

//Exec command
func Exec(c *cli.Context) error {
	defaultLanguage := c.String("lang")
	destination := c.Args().First()
	if destination == "" {
		destination = "public"
	}
	cwd, _ := os.Getwd()

	err := checkDirs(cwd)
	if err != nil {
		return err
	}
	checkDestination(destination)
	sources := getFiles(path.Join(cwd, "site"))
	languageFiles := getFiles(path.Join(cwd, "languages"))
	for _, source := range sources {
		for _, lang := range languageFiles {
			content, _ := ioutil.ReadFile(source)
			newPath := getNewPath(languageFiles, defaultLanguage, lang, destination, source)
			if isText(source) {
				contentLang, _ := ioutil.ReadFile(lang)
				languageJSON, _ := gabs.ParseJSON(contentLang)
				languageParsed, _ := languageJSON.ChildrenMap()
				contentString := string(content)
				for key, prop := range languageParsed {
					re := regexp.MustCompile("\\[" + key + "]")
					contentString = re.ReplaceAllString(contentString, prop.Data().(string))
				}
				writeFile(newPath, contentString)
			} else {
				writeFile(newPath, string(content))
			}
		}
	}

	util.ShowSuccess(util.BuildOk)
	return nil
}

func getNewPath(languageFiles []string, defaultLanguage string, lang string, destination string, source string) string {
	cwd, _ := os.Getwd()
	oldPath := filepath.Join(cwd, "site")
	ext := filepath.Ext(filepath.Base(lang))
	langFolder := filepath.Base(lang)[0 : len(filepath.Base(lang))-len(ext)]
	if len(languageFiles) <= 1 || langFolder == defaultLanguage {
		destination = filepath.Join(cwd, destination)
	} else {
		destination = filepath.Join(cwd, destination, langFolder)
	}
	return strings.Replace(source, oldPath, destination, 1)
}

func writeFile(newPath string, content string) error {
	dir := filepath.Dir(newPath)
	err := os.MkdirAll(dir, os.ModePerm)
	if err != nil {
		util.ShowError(util.NotCreatePathFile)
		fmt.Println(err)
		return errors.New(util.NotCreatePathFile)
	}
	file, err := os.Create(newPath)
	if err != nil {
		util.ShowError(util.NotCreateFile)
		fmt.Println(err)
		return errors.New(util.NotCreateFile)
	}
	file.Close()
	fileW, err := os.OpenFile(newPath, os.O_RDWR, 0644)
	if err != nil {
		util.ShowError(util.NotOpenFile)
		return errors.New(util.NotOpenFile)
	}
	_, err = fileW.WriteString(string(content))
	if err != nil {
		util.ShowError(util.NotWriteFile)
		return errors.New(util.NotWriteFile)
	}
	err = fileW.Sync()
	if err != nil {
		util.ShowError(util.NotSyncFile)
		return errors.New(util.NotSyncFile)
	}

	return nil
}

func isText(source string) bool {
	file, _ := os.Open(source)
	defer file.Close()
	buffer := make([]byte, 512)
	n, _ := file.Read(buffer)
	contentType := http.DetectContentType(buffer[:n])
	return strings.Contains(contentType, "text")
}

func checkDirs(cwd string) error {
	languagesDir := path.Join(cwd, "languages")
	siteDir := path.Join(cwd, "site")

	if _, err := os.Stat(languagesDir); os.IsNotExist(err) {
		util.ShowError(util.LanguageNotFound)
		return errors.New(util.LanguageNotFound)
	}

	if _, err := os.Stat(siteDir); os.IsNotExist(err) {
		util.ShowError(util.SiteNotFound)
		return errors.New(util.SiteNotFound)
	}

	return nil
}

func checkDestination(destination string) error {
	cwd, _ := os.Getwd()
	destination = filepath.Join(cwd, destination)
	if _, err := os.Stat(destination); err == nil {
		os.RemoveAll(destination)
	}

	os.Mkdir(destination, os.ModePerm)
	return nil
}

func getFiles(cwd string) []string {
	files := []string{}
	filepath.Walk(cwd, func(path string, info os.FileInfo, err error) error {
		if info.IsDir() {
			return nil
		}
		files = append(files, path)
		return nil
	})
	return files
}
