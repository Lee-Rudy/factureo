/**
 * Composant DrawerMenu
 * Menu latéral de navigation avec animation
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { colors, spacing, borderRadius } from '../theme';

const { width } = Dimensions.get('window');
const drawerWidth = width * 0.75;

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hasDropdown?: boolean;
  isActive?: boolean;
  onPress: () => void;
}

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userRole: string;
  menuItems: MenuItem[];
  onLogout: () => void;
  activeRoute?: string;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isOpen,
  onClose,
  userName,
  userRole,
  menuItems,
  onLogout,
  activeRoute = 'Tableau de bord',
}) => {
  const translateX = useRef(new Animated.Value(-drawerWidth)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 8,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: -drawerWidth,
          useNativeDriver: true,
          tension: 65,
          friction: 8,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, translateX, overlayOpacity]);

  return (
    <View style={styles.container} pointerEvents={isOpen ? 'auto' : 'none'}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.background.gradientMenu.start, colors.background.gradientMenu.end]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <View style={styles.header}>
              <Text variant="h2" color="inverse" bold>
                FACTUREO
              </Text>
            </View>

            <View style={styles.menuContent}>
            <View style={styles.menuItems}>
              {menuItems.map((item, index) => {
                const isActive = item.label === activeRoute;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.menuItem,
                      isActive && styles.menuItemActive,
                    ]}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemLeft}>
                      <Ionicons name={item.icon} size={24} color={colors.text.inverse} />
                      <Text variant="body1" color="inverse" style={styles.menuLabel}>
                        {item.label}
                      </Text>
                    </View>
                    {item.hasDropdown && (
                      <Ionicons name="chevron-down" size={20} color={colors.text.inverse} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.footer}>
              <View style={styles.profileSection}>
                <View style={styles.avatar}>
                  <Text variant="h4" color="inverse" bold>
                    {userName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text variant="body1" color="inverse" bold numberOfLines={1}>
                    {userName}
                  </Text>
                  <Text variant="caption" color="inverse" style={styles.userRole}>
                    {userRole}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={onLogout}
                activeOpacity={0.7}
              >
                <Ionicons name="log-out-outline" size={24} color={colors.text.inverse} />
                <Text variant="body1" color="inverse" style={styles.logoutText}>
                  Se déconnecter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: drawerWidth,
    zIndex: 1000,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  menuItems: {
    paddingTop: spacing.base,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.base,
    marginBottom: spacing.xs,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  menuLabel: {
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.base,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.base,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.tertiary.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userRole: {
    marginTop: spacing.xs / 2,
    opacity: 0.9,
  },
  divider: {
    height: 1,
    backgroundColor: colors.text.inverse,
    opacity: 0.3,
    marginVertical: spacing.base,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    paddingVertical: spacing.sm,
  },
  logoutText: {
    fontSize: 16,
  },
});
