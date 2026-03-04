require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

# Try to load nitrogen autolinking helper
nitrogen_autolinking = File.join(__dir__, 'nitrogen', 'generated', 'ios', 'NitroFBAnalytics+autolinking.rb')

Pod::Spec.new do |s|
  s.name         = 'react-native-nitro-fbanalytics'
  s.version      = package['version']
  s.summary      = package['description']
  s.homepage     = 'https://github.com/user/react-native-nitro-fbanalytics'
  s.license      = package['license']
  s.author       = 'react-native-nitro-fbanalytics contributors'
  s.source       = { :git => '.', :tag => s.version.to_s }
  s.platforms    = { :ios => '13.0' }

  s.source_files = [
    'ios/**/*.{swift,h,m,mm,cpp}',
    'nitrogen/generated/ios/**/*.{swift,h,m,mm,cpp}',
    'nitrogen/generated/shared/**/*.{swift,h,m,mm,cpp}'
  ]

  s.dependency 'React-Core'
  s.dependency 'react-native-nitro-modules'
  s.dependency 'FBSDKCoreKit', '~> 17.0'

  if File.exist?(nitrogen_autolinking)
    require nitrogen_autolinking
    add_nitrogen_files(s)
  end
end
