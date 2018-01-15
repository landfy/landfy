package util

import (
	"testing"
)

func TestShowError(t *testing.T) {
	res := ShowError("Temp message")
	if res != nil {
		t.Errorf("ShowError not ok:\n", res.Error())
	}
}

func TestShowSuccess(t *testing.T) {
	res := ShowSuccess("Temp message")
	if res != nil {
		t.Errorf("ShowSuccess not ok:\n", res.Error())
	}
}
