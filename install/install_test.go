package install

import (
	"flag"
	"testing"

	"github.com/landfy/landfy/util"
	"github.com/urfave/cli"
)

func TestExec(t *testing.T) {
	command := cli.Command{Name: "install"}
	set := flag.NewFlagSet("test", 0)
	globalSet := flag.NewFlagSet("test", 0)
	globalCtx := cli.NewContext(nil, globalSet, nil)
	c := cli.NewContext(nil, set, globalCtx)
	c.Command = command

	res := Exec(c)
	if res.Error() != util.NameTemplateNotInformed {
		t.Errorf("Install not ok:\n", res.Error())
	}

	set.Parse([]string{"name-of-template"})
	res = Exec(c)
	if res.Error() != "NOT IMPLEMENTED" {
		t.Errorf("Install not ok:\n", res.Error())
	}
}
