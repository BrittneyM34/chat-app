import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity } from 'react-native';
import { useState } from 'react';

const Start = ({ navigation }) => {
    const [name, setName] = useState("");
    const [background, setBackground] = useState('');
    const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

    // Image background source
    const image = require('../img/BackgroundImage.png');

    return (
        <View style={styles.container}>
            {/* Image background */}
            <ImageBackground
                source={image}
                style={styles.image}
            >
                {/* App title */}
                <Text style={styles.title}>Chat App</Text>

                <View style={styles.box}>
                    <TextInput
                        style={styles.textInput}
                        value={name}
                        onChangeText={setName}
                        placeholder='Type your username here'
                    />

                    {/* Choose background color of text */}
                    <Text style={styles.chooseBackgroundColor}>Choose background color</Text>
                    <View style={styles.colorButtonBox}>
                        {colors.map((color, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.colorButton, { backgroundColor: color }, background === color && styles.selected]}
                                onPress={() => setBackground(color)}
                            />
                        ))}
                    </View>

                    {/* Start chat */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Chat', { name: name, background: background })}
                    >
                        <Text style={styles.buttonText}>Start Chatting</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 45,
        fontWeight: '600',
        color: '#FFFFFF',
        margin: 20,
    },
    box: {
        backgroundColor: '#ffffff',
        padding: 30,
        width: '88%',
        height: '44%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: 50,
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 15,
        borderColor: '#757083',
    },
    chooseBackgroundColor: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: 100,
    },
    colorButtonBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 20
    },
    colorButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 5
    },
    selected: {
        borderColor: 'black',
        borderWidth: 1
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#757083',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Start;