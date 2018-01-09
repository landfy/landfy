package main

import (
	"encoding/json"
	"io/ioutil"
	"os"

	"build"
	"install"
	"server"
	"util"

	"github.com/urfave/cli"
)

//Config json file
type Config struct {
	Version string `json:"version"`
}

func getConfig() Config {
	data, err := ioutil.ReadFile("./landfy.json")
	if err != nil {
		util.ShowError("landfy.json not found!")
		os.Exit(0)
	}
	var config Config
	json.Unmarshal(data, &config)
	return config
}

func main() {
	config := getConfig()

	app := cli.NewApp()
	app.Version = config.Version
	app.Commands = []cli.Command{
		{
			Name:        "install",
			Aliases:     []string{"i"},
			Usage:       "Install a new template",
			Description: "* is required!",
			ArgsUsage:   "*[template_name] [path_install]",
			Action:      install.Exec,
		},
		{
			Name:        "build",
			Aliases:     []string{"b"},
			Usage:       "Build your site",
			Description: "* is required!",
			ArgsUsage:   "[destination]",
			Action:      build.Exec,
		},
		{
			Name:    "server",
			Aliases: []string{"s"},
			Usage:   "Run a local http server",
			Action:  server.Exec,
		},
	}

	app.Run(os.Args)
}
