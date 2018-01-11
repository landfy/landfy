package install

import (
	"fmt"

	"github.com/fabiorogeriosj/landfy/util"

	"github.com/urfave/cli"
)

//Exec command
func Exec(c *cli.Context) error {
	template := c.Args().First()
	if template == "" {
		util.ShowError("You need infomed a name of template!")
		return nil
	}
	fmt.Println("Command install with args: ", c.Args())
	return nil
}
