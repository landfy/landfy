package server

import (
	"fmt"
	
	"github.com/urfave/cli"
)

//Exec command
func Exec(c *cli.Context) error {
	fmt.Println("Command server with args: ", c.Args())
	return nil
}