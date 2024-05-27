import { Box, Newline, Text } from "ink";
import TextInput from 'ink-text-input';
import React, { useContext, useState } from "react";

import fs from "fs";
import { context } from "../context.js";
import { Menu } from "../shared/index.js";
import { AppPage, BasePageProps } from "../types.js";

function verifyDirectoryExists(directoryPath: string): boolean {
  return fs.existsSync(directoryPath);
}

enum ActiveItem {
  BackupRootDirectoryInput = 0,
  ActiveRootDirectoryInput = 1,
  ConfirmSubmit = 2,
  Submit = 3
}

type PageProps = {

}

const PageComputeMissingSetup = ({ navigatePage }: PageProps & BasePageProps) => {
  const { dispatch } = useContext(context)

  const [backupRootDirectory, setBackupRootDirectory] = useState<string>("/Users/travisbumgarner/Programming/backup-sync/algorithm_exploration/testing_dir_backup");
  const [activeRootDirectory, setActiveRootDirectory] = useState<string>("/Users/travisbumgarner/Programming/backup-sync/algorithm_exploration/testing_dir_active");
  const [activeItem, setActiveItem] = useState<ActiveItem>(ActiveItem.BackupRootDirectoryInput);

  const onTextInputSubmit = () => {
    setActiveItem(prev => prev + 1)
  }

  const menuCallback = (value: ActiveItem) => {
    dispatch({
      type: 'SET_ERROR_MESSAGE',
      payload: {
        errorMessage: ""
      }
    })

    if (value === ActiveItem.BackupRootDirectoryInput) {
      setBackupRootDirectory("")
      setActiveRootDirectory("")
    }

    if (value === ActiveItem.Submit) {
      const backupExists = verifyDirectoryExists(backupRootDirectory)
      const activeExists = verifyDirectoryExists(activeRootDirectory)

      if (!backupExists || !activeExists) {
        let newErrorMessage = ""
        backupExists || (newErrorMessage += "Backup directory does not exist.")
        activeExists || (newErrorMessage += "Active directory does not exist.")

        dispatch(
          {
            type: 'SET_ERROR_MESSAGE',
            payload: {
              errorMessage: newErrorMessage
            }
          }
        )

        setBackupRootDirectory("")
        setActiveRootDirectory("")
        setActiveItem(ActiveItem.BackupRootDirectoryInput)
        return
      }

      dispatch({
        type: 'SET_DIRECTORIES',
        payload: {
          activeRootDirectory,
          backupRootDirectory,
        }
      })
      navigatePage(AppPage.ComputeMissing)
    }
    setActiveItem(value)
  }

  return (
    <Box flexDirection="column">
      <Box>
        <Text>Backup Directory: </Text>
        {activeItem === ActiveItem.BackupRootDirectoryInput
          ? <TextInput value={backupRootDirectory} onChange={setBackupRootDirectory} onSubmit={onTextInputSubmit} />
          : <Text>{backupRootDirectory}</Text>
        }
      </Box>
      <Box>
        <Text>Active Directory: </Text>
        {activeItem === ActiveItem.ActiveRootDirectoryInput
          ? <TextInput value={activeRootDirectory} onChange={setActiveRootDirectory} onSubmit={onTextInputSubmit} />
          : <Text>{activeRootDirectory}</Text>
        }
      </Box>
      <Newline />
      <Menu
        options={[
          { label: "Submit", value: ActiveItem.Submit },
          { label: "Restart Input", value: ActiveItem.BackupRootDirectoryInput },
        ]}
        callback={menuCallback}
        isFocused={activeItem === ActiveItem.ConfirmSubmit}
      />
    </Box>
  );
}

export default PageComputeMissingSetup;