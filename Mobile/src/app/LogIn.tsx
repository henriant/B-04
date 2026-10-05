// Logg inn-felt med brukernavn og passord. Disse sammenlignes med informasjonen som er lagret i databasen (passord hashes) og lar brukeren logge inn dersom de matcher

import { useState } from "react";

export default function LogIn() {
    const [[email, password], setCredentials] = useState(["", ""]);
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log in</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => setCredentials([text, password])}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => setCredentials([email, text])}
                secureTextEntry
            />

            <Pressable style={styles.button} onpress={() => console.log(email)}></Pressable>
        
        </View> 
    )
}