require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

nitrogen_autolinking = File.join(__dir__, 'nitrogen', 'generated', 'ios', 'NitroFBAnalytics+autolinking.rb')

Pod::Spec.new do |s|
  s.name         = 'expo-facebook-analytics'
  s.version      = package['version']
  s.summary      = package['description']
  s.homepage     = 'https://github.com/user/expo-facebook-analytics'
  s.license      = package['license']
  s.author       = 'expo-facebook-analytics contributors'
  s.source       = { :git => '.', :tag => s.version.to_s }
  s.platforms    = { :ios => '13.0' }
  s.module_name  = 'NitroFBAnalytics'

  s.source_files = [
    'ios/**/*.{swift,h,hpp,m,mm,cpp}',
  ]

  s.dependency 'React-Core'

  s.frameworks = ['AdSupport']

  spm_dependency(s,
    url: 'https://github.com/facebook/facebook-ios-sdk.git',
    requirement: { kind: 'upToNextMajorVersion', minimumVersion: '18.0.3' },
    products: ['FacebookCore']
  )

  if File.exist?(nitrogen_autolinking)
    load nitrogen_autolinking
    add_nitrogen_files(s)
  end
end
