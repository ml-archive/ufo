package cmd

import (
	"fmt"
	"strings"

	"github.com/aws/aws-sdk-go/service/ecs"
	UFO "github.com/fuzz-productions/ufo/pkg/ufo"
	"github.com/spf13/cobra"
)

var serviceInfoCmd = &cobra.Command{
	Use:   "info",
	Short: "List information of currently deploy service",
	Run:   listInfo,
}

func listInfo(cmd *cobra.Command, args []string) {
	cfgCluster, err := cfg.getCluster(flagCluster)

	handleError(err)

	cfgService, err := cfg.getService(cfgCluster.Services, flagService)

	handleError(err)

	ufo := UFO.New(awsConfig)

	c, err := ufo.GetCluster(cfgCluster.Name)

	handleError(err)

	s, err := ufo.GetService(c, *cfgService)

	handleError(err)

	t, err := ufo.GetTaskDefinition(c, s)

	handleError(err)

	printServiceInfoTable(t)
}

func printServiceInfoTable(t *ecs.TaskDefinition) {
	for _, containerDefinition := range t.ContainerDefinitions {
		longestName := len("Image")
		longestValue := len(*containerDefinition.Image)
		nameDashes := strings.Repeat("-", longestName+2) // Adding two because of the table padding
		valueDashes := strings.Repeat("-", longestValue+2)

		fmt.Printf("+%s+%s+\n", nameDashes, valueDashes)

		name := "Image"
		value := *containerDefinition.Image
		nameSpaces := longestName - len(name)
		valueSpaces := longestValue - len(value)
		spacesForName := strings.Repeat(" ", nameSpaces)
		spacesForValue := strings.Repeat(" ", valueSpaces)
		fmt.Printf("| %s%s | %s%s |\n", name, spacesForName, value, spacesForValue)
		fmt.Printf("+%s+%s+\n", nameDashes, valueDashes)
	}
}

func init() {
	serviceCmd.AddCommand(serviceInfoCmd)
}
