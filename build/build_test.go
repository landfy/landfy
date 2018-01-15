package build

import (
	"flag"
	"io/ioutil"
	"os"
	"path/filepath"
	"testing"

	"github.com/fabiorogeriosj/landfy/util"
	"github.com/urfave/cli"
)

func TestExec(t *testing.T) {
	cwd, _ := os.Getwd()
	pathLanguage := filepath.Join(cwd, "languages")
	pathSite := filepath.Join(cwd, "site")

	command := cli.Command{Name: "build"}
	set := flag.NewFlagSet("test", 0)
	globalSet := flag.NewFlagSet("test", 0)
	globalCtx := cli.NewContext(nil, globalSet, nil)
	c := cli.NewContext(nil, set, globalCtx)
	c.Command = command
	res := Exec(c)
	if res.Error() != util.LanguageNotFound {
		t.Errorf("Build not ok:\n", res.Error())
	}

	createTempLanguageFile(pathLanguage)
	res = Exec(c)
	if res.Error() != util.SiteNotFound {
		t.Errorf("Build not ok:\n", res.Error())
	}

	createTempSiteFile(pathSite)
	res = Exec(c)
	if res != nil {
		t.Errorf("Build not ok:\n", res.Error())
	}

	content := getContentFile(filepath.Join(cwd, "public", "index.html"))
	if content != "<h1>A STRING OF TEST</h1>" {
		t.Errorf("Build not ok:\n", content)
	}

	removeFileTemp(pathLanguage)
	removeFileTemp(pathSite)
	removeFileTemp(filepath.Join(cwd, "public"))

}

func createTempLanguageFile(pathLanguage string) {
	os.MkdirAll(pathLanguage, os.ModePerm)
	fileLanguage := filepath.Join(pathLanguage, "en.json")
	file, _ := os.Create(fileLanguage)
	file.Close()
	file, _ = os.OpenFile(fileLanguage, os.O_RDWR, 0644)
	file.WriteString("{\"THE-TEST\": \"A STRING OF TEST\"}")
	file.Sync()
	file.Close()
}

func createTempSiteFile(pathSite string) {
	os.MkdirAll(pathSite, os.ModePerm)
	fileSite := filepath.Join(pathSite, "index.html")
	file, _ := os.Create(fileSite)
	file.Close()
	file, _ = os.OpenFile(fileSite, os.O_RDWR, 0644)
	file.WriteString("<h1>[THE-TEST]</h1>")
	file.Sync()
	file.Close()
}

func getContentFile(file string) string {
	content, _ := ioutil.ReadFile(file)
	return string(content)
}

func removeFileTemp(path string) {
	if _, err := os.Stat(path); err == nil {
		os.RemoveAll(path)
	}
}
