package main

import (
	"os"

	"github.com/landfy/landfy/build"
	"github.com/landfy/landfy/install"
	"github.com/landfy/landfy/server"

	"github.com/urfave/cli"
)

func main() {
	app := cli.NewApp()
	app.Usage = "Generate landing pages internationalized"
	app.Version = "1.0.0"
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
			Flags: []cli.Flag{
				cli.StringFlag{
					Name:  "lang",
					Value: "en",
					Usage: "set a default language generate",
				},
			},
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
