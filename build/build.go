package build

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"

	"github.com/fabiorogeriosj/landfy/util"

	"github.com/fabiorogeriosj/landfy/label"

	"github.com/Jeffail/gabs"
	"github.com/urfave/cli"
)

//Exec command
func Exec(c *cli.Context) error {
	destination := c.Args().First()
	cwd, _ := os.Getwd()
	if destination == "" {
		destination = path.Join(cwd, "public")
	}

	checkDirs(cwd)
	checkDestination(destination)
	sources := getFiles(path.Join(cwd, "site"))
	languageFiles := getFiles(path.Join(cwd, "languages"))
	for _, source := range sources {
		for _, lang := range languageFiles {
			content, _ := ioutil.ReadFile(source)
			if isText(source) {
				contentLang, _ := ioutil.ReadFile(lang)
				languageJSON, _ := gabs.ParseJSON(contentLang)
				languageParsed, _ := languageJSON.ChildrenMap()
				for key, prop := range languageParsed {
					fmt.Println("key: " + key + " value: " + prop.Data().(string))
				}
			}

			source += "" + string(content)

		}
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
		util.ShowError(label.LanguageNotFound)
		os.Exit(0)
	}

	if _, err := os.Stat(siteDir); os.IsNotExist(err) {
		util.ShowError(label.SiteNotFound)
		os.Exit(0)
	}

	return nil
}

func checkDestination(destination string) error {
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
