import { Stack } from "expo-router";
import * as React from "react";
import { View, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { Menu, Text } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { RechercherTike } from "@/components/dialog/rechercheTike";
import { useRouter, Router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CalendarDateTime,
  Time,
  getLocalTimeZone,
  toCalendarDateTime,
  today,
  now,
} from "@internationalized/date";
import useLotteryStore from "@/store/ProviderData";
import {
  accessTirage,
  blockageBoule,
  createFiche,
  getUserData,
  limitBouleParAgent,
  limiteBoule,
  limiteJeu,
  limiteJeuParAgent,
  pairwiseCombinationProduct,
} from "@/components/Lottery/logics";
import DialogMessage from "@/components/Lottery/dialog";
import __ from "lodash";
import MontantDialog from "@/components/Lottery/montantAutomatique";

export default function Homelayourt() {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [visibleMenu, setVisibleMenu] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>("");
  const [visibleMessage, setVisibleMessage] = React.useState<boolean>(false);
  const [isEl, setEl] = React.useState<boolean>(false);
  const [visibleM, setVisibleM] = React.useState<boolean>(false);
  const [isError, setError] = React.useState<boolean>(false);
  const {
    Borlette,
    Lotto3,
    Lotto4,
    Lotto5,
    Mariage,
    Tirage,
    addReload,
    addMariage,
    ClearBorlette,
    ClearLotto3,
    ClearLotto4,
    ClearLotto5,
    clearMariage,
  } = useLotteryStore((state) => ({
    Borlette: state.Borlette,
    Lotto3: state.Lotto3,
    Lotto4: state.Lotto4,
    Lotto5: state.Lotto5,
    Mariage: state.Mariage,
    Tirage: state.Tirage,
    addReload: state.addReload,
    addMariage: state.addMariage,
    ClearBorlette: state.clearBorlette,
    ClearLotto3: state.clearLotto3,
    ClearLotto4: state.clearLotto4,
    ClearLotto5: state.clearLotto5,
    clearMariage: state.clearMariage,
  }));

  const router: Router = useRouter();

  const showDialog = () => {
    setVisible(true);
  };

  const openMenu = () => setVisibleMenu(true);

  const closeMenu = () => setVisibleMenu(false);

  const Jwe = async () => {
    try {
      setError(false);
      const Today = today(getLocalTimeZone());
      const time = now(getLocalTimeZone());
      const calendarDate = new CalendarDateTime(
        Today.year,
        Today.month,
        Today.day
      );
      // get the actual date and time
      const date = toCalendarDateTime(
        calendarDate,
        new Time(time.hour, time.minute, time.second)
      );

      const vendeur = await getUserData();

      // make a mixture of all the slots played
      const totalBorlette = Borlette.concat(Lotto3, Lotto4, Lotto5, Mariage);

      // grab number of boule
      const boules = Object.values(totalBorlette.map((b) => b.numero));
      // grab number of montant
      setMessage("");
      const montant = Object.values(totalBorlette.map((b) => b.montant));
      setVisibleMessage(true);
      setLoading(true);
      // const borlette = Object.values(totalBorlette.map((b) => b.borlette));

      // test time of the slot
      const tirage = await accessTirage(Tirage);

      // blockage boule
      const bb: { data: string[]; state: boolean } = await blockageBoule(
        boules,
        Tirage[0],
        vendeur.Bank
      );
      // limite boule
      const lb: {
        data: string[];
        state: boolean;
      } = await limiteBoule(boules, montant, Tirage[0]);
      // limite boule par agent
      const lbpa: {
        data: string[];
        state: boolean;
      } = await limitBouleParAgent(boules, Tirage[0], vendeur.Bank, montant);
      // limite Jeu
      const lj = await limiteJeu(Tirage[0], totalBorlette);
      // limite Jeu Par agent
      const ljpa: { message: string; state: boolean } = await limiteJeuParAgent(
        vendeur.Bank,
        Tirage[0],
        totalBorlette
      );

      // all particular case on the receipt
      if (tirage.state == true) {
        setLoading(false);
        setMessage(tirage.message);
        setEl(true);
        // setVisibleMessage(true);
      } else if (totalBorlette.length == 0) {
        // block access in case no number is bet
        setLoading(false);
        setMessage("fok ou jwe pou piti yon boul, pou ou ka kreye yon fich");
      } else if (bb.state == true) {
        setLoading(false);
        setMessage(`${bb.data.join(",")}, sorry boule sa (yo) bloke `);
        // setVisibleMessage(true);
      } else if (lb.state == true) {
        setLoading(false);
        setMessage(
          `${lb.data.join(",")}, boule sa (yo) pa ka jwe, kob la twò wo`
        );
        // setVisibleMessage(true);
      } else if (lbpa.state == true) {
        setLoading(false);
        setMessage(
          `${lbpa.data.join(",")}, boule sa (yo) pa ka jwe, kob la twò wo`
        );
        // setVisibleMessage(true);
      } else if (lj.state == true) {
        setLoading(false);
        setMessage(lj.message);
        // setVisibleMessage(true);
      } else if (ljpa.state == true) {
        setLoading(false);
        setMessage(ljpa.message);
        // setVisibleMessage(true);
      } else {
        setLoading(true);
        setMessage("Pran yon ti pasyans pandan fich la ap trete");
        // setVisibleMessage(true);
        const ficheCreation = await createFiche(
          date.toString(),
          totalBorlette,
          `${Tirage[0].toLowerCase()}`,
          `${vendeur.Pseudoname}`,
          vendeur.Surcussale,
          `${vendeur.Bank}`
        );
        if (ficheCreation.state == true) {
          setLoading(false);
          setTimeout(() => {}, 2000);
          ClearBorlette();
          ClearLotto3();
          ClearLotto4();
          ClearLotto5();
          clearMariage();
          router.navigate("/(home)/(jwe)/confimation");
          await AsyncStorage.setItem(
            "FICHE",
            JSON.stringify({ isCreated: true })
          );
        } else {
          setMessage("Gen yon ti problèm koneksyon, verifye data ou");
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      setMessage("Gen yon ti problèm koneksyon, verifye data ou");
      setError(true);
      throw new Error(`${error}`);
    }
  };

  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Chosir un ou plusieur options",
          title: "Chosir un ou plusieur options",
          statusBarAnimation: "fade",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#651fff" },
          statusBarColor: "#651fff",
          statusBarStyle: "light",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 22,
            color: "white",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="tirage"
        options={() => {
          const title =
            Tirage.length > 1
              ? `${Tirage[0]} + ${Tirage.length - 1}`
              : Tirage[0];
          return {
            statusBarAnimation: "fade",
            statusBarColor: "#651fff",
            statusBarStyle: "light",
            title: `${__.capitalize(title)}`,
            headerTitle: `${__.capitalize(title)}`,
            headerBackVisible: false,
            headerStyle: { backgroundColor: "#651fff" },
            headerTitleStyle: { color: "white", fontSize: 24 },
            headerShadowVisible: false,
            headerRight: () => {
              return (
                <View style={{ flexDirection: "row", gap: 29 }}>
                  <Pressable onPress={showDialog}>
                    <AntDesign name="search1" size={29} color="white" />
                  </Pressable>
                  <RechercherTike visible={visible} setVisible={setVisible} />
                  <Pressable onPress={Jwe}>
                    <AntDesign name="check" size={30} color="white" />
                  </Pressable>
                  <DialogMessage
                    isVisible={visibleMessage}
                    isLoading={loading}
                    setVisible={setVisibleMessage}
                    Message={message}
                    El={isEl}
                  />
                  <Menu
                    visible={visibleMenu}
                    onDismiss={closeMenu}
                    anchor={
                      <Pressable onPress={openMenu}>
                        <Entypo
                          name="dots-three-vertical"
                          size={30}
                          color="white"
                        />
                      </Pressable>
                    }
                  >
                    <Menu.Item
                      onPress={() => router.navigate("/(home)/(jwe)")}
                      contentStyle={{ paddingHorizontal: 10 }}
                      title="Retounen avan"
                    />
                    <Menu.Item
                      onPress={() => {
                        const numeros = Borlette.map((f) =>
                          f.numero.toString()
                        );
                        closeMenu();
                        const pair = pairwiseCombinationProduct(numeros);
                        // addMariageAutomatic(pair);
                        const allMariage = pair.map((num, index) => {
                          return {
                            numero: `${num}`,
                            montant: `0`,
                            option: "-",
                            borlette: "mariage",
                          };
                        });
                        addMariage(allMariage);
                        addReload();
                      }}
                      contentStyle={{ paddingHorizontal: 10 }}
                      title="Mariage automatique"
                    />
                    <Menu.Item
                      onPress={() => {
                        setVisibleM(true);
                        // closeMenu();
                      }}
                      contentStyle={{ paddingHorizontal: 10 }}
                      title="Montant automatique"
                    />
                    <MontantDialog
                      isVisible={visibleM}
                      setVisible={setVisibleM}
                    />
                  </Menu>
                </View>
              );
            },
          };
        }}
      />
      <Stack.Screen
        name="[code]"
        options={({ route }: { route: any }) => {
          return {
            headerTitle: `FICH :  ${route.params.code}`,
            title: `Fich : ${route.params.code}`,
            headerStyle: { backgroundColor: "#651fff" },
            headerShadowVisible: false,
            headerTitleStyle: { fontSize: 20, color: "white" },
            statusBarAnimation: "fade",
            statusBarColor: "#651fff",
            statusBarStyle: "light",
            headerBackVisible: false,
          };
        }}
      />
      <Stack.Screen
        name="confimation"
        options={{
          title: "Konfimasyon Vant",
          headerTitle: "konfimasyon Vant",
          statusBarAnimation: "fade",
          statusBarColor: "#651fff",
          statusBarStyle: "light",
          headerBackVisible: false,
          headerStyle: { backgroundColor: "#651fff" },
          headerTitleStyle: { color: "white", fontSize: 24 },
          headerShadowVisible: false,
          headerRight: () => {
            return (
              <TouchableOpacity
                onPress={() => router.replace("/(home)/(jwe)/")}
              >
                <Text style={{ color: "#4caf50", fontSize: 21 }}>Retounen</Text>
              </TouchableOpacity>
            );
          },
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 40,
  },
  headerTitle: {
    flexDirection: "row",
  },
});
