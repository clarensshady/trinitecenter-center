import * as React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Button, Dialog, Menu, Portal, Text } from "react-native-paper";
import CalendarPicker from "react-native-calendar-picker";
import AntDesign from "@expo/vector-icons/AntDesign";

export interface IimprimeTikeProps {
  visibleImprime: boolean;
  setVisibleImprime: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ImprimeTike({
  visibleImprime,
  setVisibleImprime,
}: IimprimeTikeProps) {
  const showDialog = () => setVisibleImprime(true);

  const hideDialog = () => setVisibleImprime(false);
  const [rapDate, setDate] = React.useState<any>();
  const [interval, setInterval] = React.useState<string>("Midi");
  const [borlette, setBorlette] = React.useState<string>("Tous");

  const onChangeDate = (date: any) => {
    setDate(date);
  };

  const [visible, setVisible] = React.useState(false);
  const [visibleBorlette, setVisibleBorlette] = React.useState<boolean>(false);

  const openMenuBorlette = () => setVisibleBorlette(true);
  const closeMenuBorlette = () => setVisibleBorlette(false);
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <Portal>
      <Dialog visible={visibleImprime} onDismiss={hideDialog}>
        <Dialog.Title>Imprimer tickets gagnants du </Dialog.Title>
        <Dialog.Content>
          <View>
            <CalendarPicker
              width={400}
              weekdays={[
                "Dimanch",
                "Lundi",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendredi",
                "Samedi",
              ]}
              months={[
                "Janvier",
                "Février",
                "Mars",
                "Avril",
                "Mai",
                "Juin",
                "Juillet",
                "Aout",
                "Septembre",
                "Octobre",
                "Novembre",
                "Decembre",
              ]}
              selectedDayColor="#651fff"
              selectedDayTextColor="white"
              onDateChange={onChangeDate}
            />
          </View>
          <View style={styles.triage}>
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <Pressable
                  onPress={openMenu}
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Text>{interval}</Text>
                  <AntDesign name="caretdown" size={14} color="#757575" />
                </Pressable>
              }
            >
              <Menu.Item
                onPress={() => {
                  setInterval("Midi");
                  closeMenu();
                }}
                title="Mid"
              />
              <Menu.Item
                onPress={() => {
                  setInterval("Soir");
                  closeMenu();
                }}
                title="Soir"
              />
            </Menu>
            <Menu
              visible={visibleBorlette}
              onDismiss={closeMenuBorlette}
              anchor={
                <Pressable
                  onPress={openMenuBorlette}
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Text>{borlette}</Text>
                  <AntDesign name="caretdown" size={14} color="#757575" />
                </Pressable>
              }
            >
              <Menu.Item
                onPress={() => {
                  setBorlette("Tous");
                  closeMenuBorlette();
                }}
                title="Tous"
              />
              <Menu.Item
                onPress={() => {
                  setBorlette("Florida");
                  closeMenuBorlette();
                }}
                title="Florida"
              />
              <Menu.Item
                onPress={() => {
                  setBorlette("Georgia");
                  closeMenuBorlette();
                }}
                title="Georgia"
              />
              <Menu.Item
                onPress={() => {
                  setBorlette("New York");
                  closeMenuBorlette();
                }}
                title="New York"
              />
            </Menu>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button textColor="red" onPress={hideDialog}>
            {" "}
            Anile
          </Button>
          <Button textColor="#651fff" onPress={hideDialog}>
            OK
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  triage: {
    paddingLeft: 20,
    paddingTop: 20,
    flexDirection: "row",
    width: "100%",
    gap: 40,
    alignItems: "center",
  },
});
