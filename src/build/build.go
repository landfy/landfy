package build

import (
	"strings"
	
	"util"
	
	"github.com/urfave/cli"
)

//Exec command
func Exec(c *cli.Context) error {
	util.ShowSuccess("Command build with args: " + strings.Join(c.Args(), ","))
	return nil
}