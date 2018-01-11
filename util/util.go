package util

import (
	"fmt"

	"github.com/fatih/color"
)

//ShowError a error in console
func ShowError(msg string) {
	error := color.New(color.FgWhite, color.BgRed).SprintFunc()
	fmt.Fprintf(color.Output, error(" ERROR "))
	fmt.Println(" ", msg)
}

//ShowSuccess a success in console
func ShowSuccess(msg string) {
	success := color.New(color.FgWhite, color.BgGreen).SprintFunc()
	fmt.Fprintf(color.Output, success(" SUCCESS "))
	fmt.Println(" ", msg)
}
