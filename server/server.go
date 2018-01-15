package server

import (
	"errors"
	"fmt"

	"github.com/urfave/cli"
)

//Exec command
func Exec(c *cli.Context) error {
	fmt.Println("Command server with args: ", c.Args())
	return errors.New("NOT IMPLEMENTED")
}
