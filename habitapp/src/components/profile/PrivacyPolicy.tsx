import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal, // ✅ NEW
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useColorStore from '../../store/ColorStore';
import HeaderBar from '../header/HeaderBar';


const PrivacyPolicy = ({ visible, onClose, navigation }:any) => {
  const currentTheme = useColorStore(state => state.currentTheme);
  const primaryColors = useColorStore(state => state.primaryColors);

  const handleBack = () => {
    if (onClose) {
      onClose(); // Close the modal
    } else if (navigation && navigation.goBack) {
      navigation.goBack(); // Fallback if used as a screen
    }
  };

  const policyLastUpdated = "May 21, 2025";

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent={true}
      onRequestClose={handleBack}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: currentTheme.Background }]}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={[styles.card, { backgroundColor: currentTheme.Card }]}>
              <HeaderBar title="Privacy Policy" />
              <Text style={[styles.lastUpdated, { color: currentTheme.SecondoryText }]}>
                Last Updated: {policyLastUpdated}
              </Text>

            <View style={styles.section}>
              <Text style={[styles.heading, { color: currentTheme.PrimaryText }]}>
                Welcome to HabitTracker
              </Text>
              <Text style={[styles.paragraph, { color: currentTheme.PrimaryText }]}>
                Thank you for choosing HabitTracker. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share your information when you use our mobile application.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: primaryColors.Primary }]}>
                Information We Collect
              </Text>
              <Text style={[styles.paragraph, { color: currentTheme.PrimaryText }]}>
                <Text style={styles.bold}>Personal Information:</Text> When you register, we collect your name, email address, and profile picture if you choose to upload one.
              </Text>
              <Text style={[styles.paragraph, { color: currentTheme.PrimaryText }]}>
                <Text style={styles.bold}>Usage Data:</Text> We collect information about how you use the app, including habits you create, completion records, and app interaction patterns.
              </Text>
              <Text style={[styles.paragraph, { color: currentTheme.PrimaryText }]}>
                <Text style={styles.bold}>Device Information:</Text> We collect device information such as your mobile device ID, model, and operating system.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: primaryColors.Primary }]}>
                How We Use Your Information
              </Text>
              <Text style={[styles.paragraph, { color: currentTheme.PrimaryText }]}>
                We use the information we collect to:
              </Text>
              <View style={styles.bulletPoints}>
                <Text style={[styles.bulletPoint, { color: currentTheme.PrimaryText }]}>• Provide, maintain, and improve our services</Text>
                <Text style={[styles.bulletPoint, { color: currentTheme.PrimaryText }]}>• Personalize your experience</Text>
                <Text style={[styles.bulletPoint, { color: currentTheme.PrimaryText }]}>• Send you notifications about your habits and progress</Text>
                <Text style={[styles.bulletPoint, { color: currentTheme.PrimaryText }]}>• Generate anonymized, aggregated statistics</Text>
                <Text style={[styles.bulletPoint, { color: currentTheme.PrimaryText }]}>• Protect against fraud and abuse</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: primaryColors.Primary }]}>
                Data Storage and Security
              </Text>
              <Text style={[styles.paragraph, { color: currentTheme.PrimaryText }]}>
                Your personal data is stored locally on your device and synchronized with our secure servers. We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: primaryColors.Primary }]}>
                Sharing Your Information
              </Text>
              <Text style={[styles.paragraph, { color: currentTheme.PrimaryText }]}>
                We do not sell your personal information to third parties. We may share your information with:
              </Text>
              <View style={styles.bulletPoints}>
                <Text style={[styles.bulletPoint, { color: currentTheme.PrimaryText }]}>• Service providers who help us deliver our services</Text>
                <Text style={[styles.bulletPoint, { color: currentTheme.PrimaryText }]}>• Legal authorities when required by law</Text>
                <Text style={[styles.bulletPoint, { color: currentTheme.PrimaryText }]}>• Other parties with your explicit consent</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: primaryColors.Primary }]}>
                Your Rights
              </Text>
              <Text style={[styles.paragraph, { color: currentTheme.PrimaryText }]}>
                Depending on your location, you may have the right to:
              </Text>
              <View style={styles.bulletPoints}>
                <Text style={[styles.bulletPoint, { color: currentTheme.PrimaryText }]}>• Access the personal data we hold about you</Text>
                <Text style={[styles.bulletPoint, { color: currentTheme.PrimaryText }]}>• Request correction of your personal data</Text>
                <Text style={[styles.bulletPoint, { color: currentTheme.PrimaryText }]}>• Request deletion of your personal data</Text>
                <Text style={[styles.bulletPoint, { color: currentTheme.PrimaryText }]}>• Object to our processing of your data</Text>
                <Text style={[styles.bulletPoint, { color: currentTheme.PrimaryText }]}>• Request restriction of processing your data</Text>
                <Text style={[styles.bulletPoint, { color: currentTheme.PrimaryText }]}>• Request transfer of your data</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: primaryColors.Primary }]}>
                Children's Privacy
              </Text>
              <Text style={[styles.paragraph, { color: currentTheme.PrimaryText }]}>
                Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: primaryColors.Primary }]}>
                Changes to This Policy
              </Text>
              <Text style={[styles.paragraph, { color: currentTheme.PrimaryText }]}>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: primaryColors.Primary }]}>
                Contact Us
              </Text>
              <Text style={[styles.paragraph, { color: currentTheme.PrimaryText }]}>
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </Text>
              <Text style={[styles.contactEmail, { color: primaryColors.Info }]}>
                privacy@habittracker.com
              </Text>
            </View>

           <TouchableOpacity
                style={[styles.backButton, { backgroundColor: primaryColors.Primary }]}
                onPress={handleBack}
              >
                <Text style={styles.backButtonText}>Back to Settings</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
     modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // dark transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    maxHeight: '90%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  lastUpdated: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 16,
    textAlign: 'right',
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  bold: {
    fontWeight: '700',
  },
  bulletPoints: {
    marginLeft: 8,
    marginTop: 4,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 6,
  },
  contactEmail: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
});

export default PrivacyPolicy;