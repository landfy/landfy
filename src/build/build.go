package build

import (
	"fmt"
	"label"
	"os"
	"path"
	"path/filepath"
	"util"

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
	sources := getFiles(cwd)
	for _, source := range sources {
		fmt.Println(source)
	}

	return nil
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
	siteDir := path.Join(cwd, "site")
	files, _ := filepath.Glob(siteDir)
	return files
}
