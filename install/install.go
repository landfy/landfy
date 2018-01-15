package install

import (
	"errors"
	"fmt"

	"github.com/fabiorogeriosj/landfy/util"

	"github.com/urfave/cli"
)

//Exec command
func Exec(c *cli.Context) error {
	template := c.Args().First()
	if template == "" {
		util.ShowError(util.NameTemplateNotInformed)
		return errors.New(util.NameTemplateNotInformed)
	}
	fmt.Println("Command install with args: ", c.Args())
	return errors.New("NOT IMPLEMENTED")
}
