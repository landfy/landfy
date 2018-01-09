package util

import (
	"fmt"

	"github.com/fatih/color"
)

//ShowError a error in console
func ShowError(msg string)  {
	error := color.New(color.FgWhite, color.BgRed).SprintFunc()
	fmt.Println(error(" ERROR "), msg)
}

//ShowSuccess a success in console
func ShowSuccess(msg string)  {
	success := color.New(color.FgWhite, color.BgGreen).SprintFunc()
	fmt.Println(success(" SUCCESS "), msg)
}