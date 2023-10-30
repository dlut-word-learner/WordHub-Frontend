export const messages = {
  zh_cn: {
    app: {
      login: "登录",
      logout: "退出登录",
      dict: "词典",
      ui: "UI",
      options: "选项",
      loggedOut: "未登录",
      prompt: "提示",
      logoutPrompt: "确定要退出登录吗？",
      confirm: "确定",
      cancel: "取消",
      userInfo: "个人资料",
    },
    login: {
      userLogin: "用户登录",
      username: "用户名",
      password: "密码",
      login: "登录",
      register: "注册",
      inputPrompt: "请输入用户名和密码",
      successPrompt: "登录成功",
      userErrPrompt: "用户名或密码错误",
      networkErrPrompt: "网络异常",
    },
    register: {
      userRegister: "用户注册",
      username: "用户名",
      passwd1: "密码",
      passwd2: "确认密码",
      diffPrompt: "两次密码不一致",
      passwdTip1: "1. 8-20 字符",
      passwdTip2: "2. 需同时包含字母和数字",
      inputPrompt: "请完整填写注册信息",
      invalidPwd: "密码不符合要求",
      email: "邮箱",
      avatar: "头像",
      defAvatar: "使用默认头像",
      clickUploadAvatar: "点击上传头像",
      avatarTypeErr: "头像格式错误",
      avatarUploadSuccess: "头像上传成功",
      register: "注册",
      successPrompt: "注册成功",
      errPrompt: "注册失败，请检查网络是否正常",
    },
    dict: {
      all: "全部词典",
      en: "英语词典",
      ja: "日语词典",
      startLearn: "开始学习",
      errGetDicts: "获取词典失败，请检查网络是否正常",
    },
    ui: {
      typingToStart: "键入以开始",
      goToNextWord: "下一个单词",
      prompt: "提示",
      confirm: "确认",
      cancel: "取消",
      promptGoToNextWord: "当前单词尚未拼写正确，确定要切换到下一个单词吗？",
      correctSpelling: "拼写正确！",
      wrongSpelling: "拼写错误，请继续尝试。",
      elapsedTime: "用时",
      progress: "进度",
      speed: "速度",
      accuracy: "正确率",
      finishPrompt: "恭喜，你已完成所有单词！",
    },
    options: {
      autoNext: "拼写正确自动切换",
      showPrevNext: "显示上一个/下一个单词",
      hideWord: "隐藏单词",
      hideMeaning: "隐藏释义",
      enableSound: "启用音效",
      volume: "音量",
      lang: "语言",
      darkMode: "深色模式",
    },
    userInfo: {
      nav: {
        basic: "基本信息",
        changePwd: "修改密码",
        changeAvatar: "修改头像",
        deleteUser: "注销用户",
      },
      basic: {
        errGetInfo: "获取用户信息失败，请检查网络是否正常",
        id: "ID",
        username: "用户名",
        role: "用户组",
        normalUser: "普通用户",
        admin: "管理员",
        email: "邮箱",
        score: "积分",
        save: "保存",
        inputPrompt: "请输入新用户名和邮箱",
        successPrompt: "保存成功",
        errPrompt: "保存失败，请检查网络是否正常",
      },
      pwd: {
        originalPwd: "原密码",
        newPasswd1: "新密码",
        newPasswd2: "确认新密码",
        save: "保存",
        inputPrompt: "请完整填写所有信息",
        samePrompt: "新密码与原密码相同",
        diffPrompt: "两次新密码不一致",
        originalPwdPrompt: "原密码错误",
        successPrompt: "保存成功",
        errPrompt: "保存失败，请检查网络是否正常",
      },
      avatar: {
        errGetAvatar: "获取头像失败，请检查网络是否正常",
        currAvatar: "当前头像",
        clickUpload: "点击上传新头像",
        save: "保存",
        successPrompt: "保存成功",
        errPrompt: "保存失败，请检查网络是否正常",
      },
      delete: {
        username: "将要注销的用户",
        passwd1: "密码",
        passwd2: "确认密码",
        delete: "注销",
        confirm: "确认",
        cancel: "取消",
        prompt: "提示",
        deletePrompt:
          "确定要注销此用户吗？这将删除此用户的所有数据，并且无法撤销。",
        inputPrompt: "请输入密码和确认密码",
        diffPrompt: "密码不一致",
        wrongPwdPrompt: "密码错误",
        successPrompt: "注销成功",
        errPrompt: "注销失败，请检查网络是否正常",
      },
    },
  },
  en: {
    app: {
      login: "Login",
      logout: "Logout",
      dict: "Dictionary",
      ui: "UI",
      options: "Options",
      loggedOut: "Logged out",
      prompt: "Prompt",
      logoutPrompt: "Are you sure you want to logout?",
      confirm: "Confirm",
      cancel: "Cancel",
      userInfo: "My Profile",
    },
    login: {
      userLogin: "User Login",
      username: "Username",
      password: "Password",
      login: "Login",
      register: "Register",
      inputPrompt: "Please input your username and password",
      successPrompt: "Logged in successfully",
      userErrPrompt: "Username or password is incorrect",
      networkErrPrompt: "Login failed, please check your network status",
    },
    register: {
      userRegister: "User Register",
      username: "Username",
      passwd1: "Password",
      passwd2: "Confirm Password",
      diffPrompt: "The two passwords are inconsistent",
      passwdTip1: "1. 8-20 Characters",
      passwdTip2: "2. Both letters and digits are required",
      inputPrompt: "Please enter all required fields",
      invalidPwd: "Invalid Password",
      email: "E-mail",
      avatar: "Avatar",
      defAvatar: "Use default avatar",
      clickUploadAvatar: "Click to upload avatar",
      avatarTypeErr: "Invalid avatar format",
      avatarUploadSuccess: "Uploaded avatar successfully",
      successPrompt: "Registered successfully",
      errPrompt: "Register failed, please check network status",
      register: "Register",
    },
    dict: {
      all: "All Dictionaries",
      en: "English Dictionary",
      ja: "Japanese Dictionary",
      startLearn: "Start Learning",
      errGetDicts:
        "Failed to get dictionaries, please check you network status",
    },
    ui: {
      typingToStart: "Type to start",
      goToNextWord: "Next Word",
      prompt: "Prompt",
      confirm: "Confirm",
      cancel: "Cancel",
      promptGoToNextWord:
        "The current word is not yet spelled correctly. Are you sure you want to switch to the next word?",
      correctSpelling: "Correct!",
      wrongSpelling: "Spelling error, please continue to try.",
      elapsedTime: "Elapsed Time",
      progress: "Progress",
      speed: "Speed",
      accuracy: "Accuracy",
      finishPrompt:
        "Congratulations, you have completed spelling all the words!",
    },
    options: {
      autoNext: "Auto switching for correct spelling",
      showPrevNext: "Show previous/next word",
      hideWord: "Hide words",
      hideMeaning: "Hide meanings",
      enableSound: "Sound effects",
      volume: "Volume",
      lang: "Language",
      darkMode: "Dark mode",
    },
    userInfo: {
      nav: {
        basic: "Basic Information",
        changePwd: "Change Password",
        changeAvatar: "Change Avatar",
        deleteUser: "Delete User",
      },
      basic: {
        errGetInfo:
          "Failed to get user information, please check your network status",
        id: "ID",
        username: "Username",
        role: "User Group",
        normalUser: "Users",
        admin: "Administrators",
        email: "E-mail",
        score: "Score",
        save: "Save",
        inputPrompt: "Please input your new username and e-mail",
        successPrompt: "Saved successfully",
        errPrompt:
          "Failed to save information, please check your network status",
      },
      pwd: {
        originalPwd: "Original Password",
        newPasswd1: "New Password",
        newPasswd2: "Confirm New Password",
        save: "Save",
        inputPrompt: "Please enter all required fields",
        samePrompt: "The new password is same as the original password",
        diffPrompt: "The two new passwords are inconsistent",
        originalPwdPrompt: "Incorrect original password",
        successPrompt: "Saved successfully",
        errPrompt: "Failed to save, please check your network status",
      },
      avatar: {
        errGetAvatar: "Failed to get avatar, please check your network status",
        currAvatar: "Current Avatar",
        clickUpload: "Click to upload new avatar",
        save: "Save",
        successPrompt: "Saved successfully",
        errPrompt: "Failed to save, please check your network status",
      },
      delete: {
        username: "User to be deleted",
        passwd1: "Password",
        passwd2: "Confirm Password",
        delete: "Delete",
        confirm: "Confirm",
        cancel: "Cancel",
        prompt: "Prompt",
        deletePrompt:
          "Are you sure to delete the user? This operation will delete all data regarding this user, which is unable to recover.",
        inputPrompt: "Please input your password and confirm password",
        diffPrompt: "The two passwords are inconsistent",
        wrongPwdPrompt: "Incorrect password",
        successPrompt: "Deleted successfully",
        errPrompt: "Failed to delete, please check your network status",
      },
    },
  },
  ja: {
    app: {
      login: "登录",
      logout: "退出登录",
      dict: "词典",
      ui: "UI",
      options: "选项",
      loggedOut: "未登录",
      prompt: "提示",
      logoutPrompt: "确定要退出登录吗？",
      confirm: "确定",
      cancel: "取消",
      userInfo: "个人资料",
    },
    login: {
      userLogin: "用户登录",
      username: "用户名",
      password: "密码",
      login: "登录",
      register: "注册",
      inputPrompt: "请完整填写注册信息",
      successPrompt: "登录成功",
      userErrPrompt: "用户名或密码错误",
      networkErrPrompt: "网络异常",
    },
    register: {
      userRegister: "用户注册",
      username: "用户名",
      passwd1: "密码",
      passwd2: "确认密码",
      diffPrompt: "两次密码不一致",
      passwdTip1: "1. 8-20 字符",
      passwdTip2: "2. 需同时包含字母和数字",
      inputPrompt: "请输入用户名和邮箱",
      invalidPwd: "密码不符合要求",
      email: "邮箱",
      avatar: "头像",
      clickUploadAvatar: "点击上传头像",
      defAvatar: "使用默认头像",
      avatarTypeErr: "头像格式错误",
      avatarUploadSuccess: "头像上传成功",
      register: "注册",
      successPrompt: "注册成功",
      errPrompt: "注册失败，请检查网络是否正常",
    },
    dict: {
      all: "全部词典",
      en: "英语词典",
      ja: "日语词典",
      startLearn: "开始学习",
      errGetDicts: "获取词典失败，请检查网络是否正常",
    },
    ui: {
      typingToStart: "键入以开始",
      goToNextWord: "下一个单词",
      prompt: "提示",
      confirm: "确认",
      cancel: "取消",
      promptGoToNextWord: "当前单词尚未拼写正确，确定要切换到下一个单词吗？",
      correctSpelling: "拼写正确！",
      wrongSpelling: "拼写错误，请继续尝试。",
      elapsedTime: "用时",
      progress: "进度",
      speed: "速度",
      accuracy: "正确率",
      finishPrompt: "恭喜，你已完成所有单词！",
    },
    options: {
      autoNext: "拼写正确自动切换",
      showPrevNext: "显示上一个/下一个单词",
      hideWord: "隐藏单词",
      hideMeaning: "隐藏释义",
      enableSound: "启用音效",
      volume: "音量",
      lang: "语言",
      darkMode: "深色模式",
    },
    userInfo: {
      nav: {
        basic: "基本信息",
        changePwd: "修改密码",
        changeAvatar: "修改头像",
        deleteUser: "注销用户",
      },
      basic: {
        errGetInfo: "获取用户信息失败，请检查网络是否正常",
        id: "ID",
        username: "用户名",
        role: "用户组",
        normalUser: "普通用户",
        admin: "管理员",
        email: "邮箱",
        score: "积分",
        save: "保存",
        inputPrompt: "请输入新用户名和邮箱",
        successPrompt: "保存成功",
        errPrompt: "保存失败，请检查网络是否正常",
      },
      pwd: {
        originalPwd: "原密码",
        newPasswd1: "新密码",
        newPasswd2: "确认新密码",
        save: "保存",
        inputPrompt: "请完整填写所有信息",
        samePrompt: "新密码与原密码相同",
        diffPrompt: "两次新密码不一致",
        originalPwdPrompt: "原密码错误",
        successPrompt: "保存成功",
        errPrompt: "保存失败，请检查网络是否正常",
      },
      avatar: {
        errGetAvatar: "获取头像失败，请检查网络是否正常",
        currAvatar: "当前头像",
        clickUpload: "点击上传新头像",
        save: "保存",
        successPrompt: "保存成功",
        errPrompt: "保存失败，请检查网络是否正常",
      },
      delete: {
        username: "将要注销的用户",
        passwd1: "密码",
        passwd2: "确认密码",
        delete: "注销",
        confirm: "确认",
        cancel: "取消",
        prompt: "提示",
        deletePrompt:
          "确定要注销此用户吗？这将删除此用户的所有数据，并且无法撤销。",
        inputPrompt: "请输入密码和确认密码",
        diffPrompt: "密码不一致",
        wrongPwdPrompt: "密码错误",
        successPrompt: "注销成功",
        errPrompt: "注销失败，请检查网络是否正常",
      },
    },
  },
};
