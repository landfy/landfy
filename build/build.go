package build

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/fabiorogeriosj/landfy/util"

	"github.com/Jeffail/gabs"
	"github.com/urfave/cli"
)

//Exec command
func Exec(c *cli.Context) error {
	destination := c.Args().First()
	if destination == "" {
		destination = "public"
	}
	cwd, _ := os.Getwd()

	checkDirs(cwd)
	checkDestination(destination)
	sources := getFiles(path.Join(cwd, "site"))
	languageFiles := getFiles(path.Join(cwd, "languages"))
	for _, source := range sources {
		for _, lang := range languageFiles {
			content, _ := ioutil.ReadFile(source)
			//Opter o config
			newPath := getNewPath(languageFiles, "", lang, destination, source)
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

func getNewPath(languageFiles []string, config string, lang string, destination string, source string) string {
	cwd, _ := os.Getwd()
	oldPath := filepath.Join(cwd, "site")
	destination = filepath.Join(cwd, destination)
	//fmt.Println("source: ", source, "old: ", oldPath, "new: ", destniation)
	return strings.Replace(source, oldPath, destination, 1)
}

func writeFile(newPath string, content string) {
	dir := filepath.Dir(newPath)
	err := os.MkdirAll(dir, os.ModePerm)
	if err != nil {
		util.ShowError(util.NotCreatePathFile)
		fmt.Println(err)
		os.Exit(0)
	}
	file, err := os.Create(newPath)
	if err != nil {
		util.ShowError(util.NotCreateFile)
		fmt.Println(err)
		os.Exit(0)
	}
	file.Close()
	fileW, err := os.OpenFile(newPath, os.O_RDWR, 0644)
	if err != nil {
		util.ShowError(util.NotOpenFile)
		os.Exit(0)
	}
	_, err = fileW.WriteString(string(content))
	if err != nil {
		util.ShowError(util.NotWriteFile)
		os.Exit(0)
	}
	err = fileW.Sync()
	if err != nil {
		util.ShowError(util.NotSyncFile)
		os.Exit(0)
	}
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
		os.Exit(0)
	}

	if _, err := os.Stat(siteDir); os.IsNotExist(err) {
		util.ShowError(util.SiteNotFound)
		os.Exit(0)
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
