export const messages = {
  zh_cn: {
    badRequest: "请求无效",
    unauthorized: "尚未登录",
    forbidden: "无权限访问",
    notFound: "请求的页面未找到",
    internalErr: "服务器内部错误",
    unknownErr: "未知错误",
    chkNet: "请检查网络是否正常",
    app: {
      login: "登录",
      logout: "退出登录",
      dict: "词典",
      learn: "学习",
      review: "复习",
      qwertyMode: "Qwerty 模式",
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
      netErrPrompt: "网络异常",
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
      errPrompt: "注册失败，{err}",
    },
    dict: {
      all: "全部词典",
      en: "英语词典",
      ja: "日语词典",
      recentlyUsed: "最近常用",
      learn: "学习",
      review: "复习",
      qwertyMode: "Qwerty 模式",
      errGetDicts: "获取词典失败，{err}",
      prompt: "提示",
      currTaskPrompt: "有学习任务正在进行，您想要如何处理？",
      continueCurrTask: "继续之前的学习任务",
      startNewTask: "开始新的学习任务",
      loginFirst: "请先登录",
    },
    learn: {
      errGetWords: "获取单词失败，{err}",
      showAns: "显示答案",
      know: "认识",
      dontknow: "不认识",
      correctSpelling: "拼写正确！",
      wrongSpelling: "拼写错误，请继续尝试。",
      errUploadRec: "上传学习记录失败，{err}",
      tryAgain: "稍后再试",
      finishPrompt: "恭喜，你已学完所有单词！",
    },
    review: {
      errGetWords: "获取单词失败，{err}",
      hard: "困难",
      good: "良好",
      easy: "容易",
      correctSpelling: "拼写正确！",
      wrongSpelling: "拼写错误，请继续尝试。",
      errUploadRec: "上传复习记录失败，{err}",
      learnAgain: "稍后重新学习",
      finishPrompt: "恭喜，你已复习完所有单词！",
      goBack: "返回主菜单",
    },
    qwerty: {
      errGetWords: "获取单词失败，{err}",
      typingToStart: "键入以开始",
      goToNextWord: "下一个单词",
      prompt: "提示",
      confirm: "确认",
      cancel: "取消",
      promptGoToNextWord: "当前单词尚未拼写正确，确定要切换到下一个单词吗？",
      correctSpelling: "拼写正确！",
      wrongSpelling: "拼写错误，请继续尝试。",
      finishPrompt: "恭喜，你已完成所有单词！",
      goBack: "返回主菜单",
    },
    stats: {
      elapsedTime: "用时",
      progress: "进度",
      speed: "速度",
      accuracy: "正确率",
    },
    options: {
      learnWordsPerRound: "每轮学习单词数",
      reviewWordsPerRound: "每轮复习单词数",
      qwertyWordsPerRound: "Qwerty 模式每轮单词数",
      qwertyOnly: "注意：以下设置仅对 Qwerty 模式有效",
      autoNext: "拼写正确自动切换",
      showPrevNext: "显示上一个/下一个单词",
      hideWord: "隐藏单词",
      hideMeaning: "隐藏释义",
      enableSound: "启用音效",
      volume: "音量",
      lang: "语言",
      darkMode: "深色模式",
      enableAnimation: "启用动画",
    },
    userInfo: {
      nav: {
        basic: "基本信息",
        changePwd: "修改密码",
        changeAvatar: "修改头像",
        deleteUser: "注销用户",
      },
      basic: {
        errGetInfo: "获取用户信息失败，{err}",
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
        errPrompt: "保存失败，{err}",
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
        errPrompt: "保存失败，{err}",
      },
      avatar: {
        currAvatar: "当前头像",
        clickUpload: "点击上传新头像",
        save: "保存",
        successPrompt: "保存成功",
        errPrompt: "保存失败，{err}",
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
        errPrompt: "注销失败，{err}",
      },
    },
  },
  en: {
    badRequest: "bad request",
    unauthorized: "logged out",
    forbidden: "access is denied",
    notFound: "the requested page is not found",
    internalErr: "internal server error",
    unknownErr: "unknown error",
    chkNet: "please check your network status",
    app: {
      login: "Login",
      logout: "Logout",
      dict: "Dictionary",
      learn: "Learn",
      review: "Review",
      qwertyMode: "Qwerty Mode",
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
      netErrPrompt: "Login failed, {err}",
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
      errPrompt: "Register failed, {err}",
      register: "Register",
    },
    dict: {
      all: "All Dictionaries",
      en: "English",
      ja: "Japanese",
      recentlyUsed: "Recently Used",
      learn: "Learn",
      review: "Review",
      qwertyMode: "Qwerty Mode",
      errGetDicts: "Failed to get dictionaries, {err}",
      prompt: "Prompt",
      currTaskPrompt:
        "There is a learning task in progress. How do you want to handle it?",
      continueCurrTask: "Continue the current task",
      startNewTask: "Start a new task",
      loginFirst: "Please log in first",
    },
    learn: {
      errGetWords: "Failed to get words, {err}",
      showAns: "Show Answer",
      know: "Know",
      dontknow: "Don't Know",
      errUploadRec: "Failed to upload learning records, {err}",
      correctSpelling: "Correct!",
      wrongSpelling: "Spelling error, please continue to try.",
      tryAgain: "Try again later",
      finishPrompt:
        "Congratulations, you have completed learning all the words!",
    },
    review: {
      errGetWords: "Failed to get words, {err}",
      hard: "Hard",
      good: "Good",
      easy: "Easy",
      correctSpelling: "Correct!",
      wrongSpelling: "Spelling error, please continue to try.",
      errUploadRec: "Failed to upload reviewing records, {err}",
      learnAgain: "Learn again later",
      finishPrompt:
        "Congratulations, you have completed reviewing all the words!",
      goBack: "Back",
    },
    qwerty: {
      errGetWords: "Failed to get words, {err}",
      typingToStart: "Type to start",
      goToNextWord: "Next Word",
      prompt: "Prompt",
      confirm: "Confirm",
      cancel: "Cancel",
      promptGoToNextWord:
        "The current word is not yet spelled correctly. Are you sure you want to switch to the next word?",
      correctSpelling: "Correct!",
      wrongSpelling: "Spelling error, please continue to try.",
      finishPrompt:
        "Congratulations, you have completed spelling all the words!",
      goBack: "Back",
    },
    stats: {
      elapsedTime: "Elapsed Time",
      progress: "Progress",
      speed: "Speed",
      accuracy: "Accuracy",
    },
    options: {
      learnWordsPerRound: "Number of words to learn per round",
      reviewWordsPerRound: "Number of words to review per round",
      qwertyWordsPerRound: "Number of words per round in Qwerty mode",
      qwertyOnly: "Note: the following options are only valid for Qwerty mode",
      autoNext: "Auto switching for correct spelling",
      showPrevNext: "Show previous/next word",
      hideWord: "Hide words",
      hideMeaning: "Hide meanings",
      enableSound: "Sound effects",
      volume: "Volume",
      lang: "Language",
      darkMode: "Dark mode",
      enableAnimation: "Enable animation",
    },
    userInfo: {
      nav: {
        basic: "Basic Information",
        changePwd: "Change Password",
        changeAvatar: "Change Avatar",
        deleteUser: "Delete User",
      },
      basic: {
        errGetInfo: "Failed to get user information, {err}",
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
        errPrompt: "Failed to save information, {err}",
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
        errPrompt: "Failed to save, {err}",
      },
      avatar: {
        currAvatar: "Current Avatar",
        clickUpload: "Click to upload new avatar",
        save: "Save",
        successPrompt: "Saved successfully",
        errPrompt: "Failed to save, {err}",
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
        errPrompt: "Failed to delete, {err}",
      },
    },
  },
  ja: {
    badRequest: "リクエストは無効です",
    unauthorized: "まだログインしていません",
    forbidden: "アクセス禁止",
    notFound: "リクエストされたページが見つかりません",
    internalErr: "内部サーバーエラー",
    unknownErr: "未知のエラー",
    chkNet: "ネットワークが正常かどうかを確認してください",
    app: {
      login: "ログイン",
      logout: "ログアウト",
      dict: "辞書",
      learn: "学習",
      review: "復習",
      qwertyMode: "Qwerty モード",
      options: "オプション",
      loggedOut: "ログアウトしています",
      prompt: "プロンプト",
      logoutPrompt: "ログアウトしますか？",
      confirm: "確認",
      cancel: "キャンセル",
      userInfo: "ユーザー情報",
    },
    login: {
      userLogin: "ユーザーログイン",
      username: "ユーザー名",
      password: "パスワード",
      login: "ログイン",
      register: "登録",
      inputPrompt: "登録情報をすべて入力してください",
      successPrompt: "ログインに成功しました",
      userErrPrompt: "ユーザー名またはパスワードが間違っています",
      netErrPrompt: "ネットワークエラー",
    },
    register: {
      userRegister: "ユーザー登録",
      username: "ユーザー名",
      passwd1: "パスワード",
      passwd2: "パスワードの確認",
      diffPrompt: "パスワードが一致しません",
      passwdTip1: "1. 8-20 文字であること",
      passwdTip2: "2. 英字と数字を含める必要があります",
      inputPrompt: "ユーザー名とメールアドレスを入力してください",
      invalidPwd: "パスワードが要件を満たしていません",
      email: "メールアドレス",
      avatar: "アバター",
      clickUploadAvatar: "クリックしてアバターをアップロード",
      defAvatar: "デフォルトアバターを使用",
      avatarTypeErr: "アバターの形式が正しくありません",
      avatarUploadSuccess: "アバターのアップロードに成功しました",
      register: "登録",
      successPrompt: "登録に成功しました",
      errPrompt: "登録に失敗しました。{err}",
    },
    dict: {
      all: "すべての辞書",
      en: "英語辞書",
      ja: "日本語辞書",
      recentlyUsed: "最近常用",
      learn: "学習",
      review: "復習",
      qwertyMode: "Qwerty モード",
      errGetDicts: "辞書の取得に失敗しました。{err}",
      prompt: "プロンプト",
      currTaskPrompt: "学習タスクが進行中です。どのように処理しますか？",
      continueCurrTask: "前回のタスクを続ける",
      startNewTask: "新しいタスクを始める",
      loginFirst: "まずログインしてください",
    },
    learn: {
      errGetWords: "単語の取得に失敗しました。{err}",
      showAns: "回答を表示する",
      know: "知っている",
      dontknow: "知らない",
      correctSpelling: "スペルが正しいです！",
      wrongSpelling: "スペルが間違っています。続けて試してください。",
      errUploadRec: "学習記録のアップロードに失敗しました。{err}",
      tryAgain: "後でもう一度試してください",
      finishPrompt: "おめでとうございます。すべての単語の学習を完了しました！",
    },
    review: {
      errGetWords: "単語の取得に失敗しました。{err}",
      hard: "難しい",
      good: "良い",
      easy: "易い",
      correctSpelling: "スペルが正しいです！",
      wrongSpelling: "スペルが間違っています。続けて試してください。",
      errUploadRec: "復習記録のアップロードに失敗しました。{err}",
      learnAgain: "後で再学習",
      finishPrompt: "おめでとうございます。すべての単語の復習を完了しました！",
      goBack: "ホームページに戻る",
    },
    qwerty: {
      errGetWords: "単語の取得に失敗しました。{err}",
      typingToStart: "入力して開始",
      goToNextWord: "次の単語に進む",
      prompt: "プロンプト",
      confirm: "確認",
      cancel: "キャンセル",
      promptGoToNextWord:
        "現在の単語が正しくスペルされていません。次の単語に切り替えますか？",
      correctSpelling: "スペルが正しいです！",
      wrongSpelling: "スペルが間違っています。続けて試してください。",
      finishPrompt: "おめでとうございます。すべての単語を完了しました！",
      goBack: "ホームページに戻る",
    },
    stats: {
      elapsedTime: "経過時間",
      progress: "進捗",
      speed: "速度",
      accuracy: "正確性",
    },
    options: {
      learnWordsPerRound: "1 ラウンドあたりに学習する単語数",
      reviewWordsPerRound: "1 ラウンドあたりに復習する単語数",
      qwertyWordsPerRound: "Qwerty モードでの 1 ラウンドあたりの単語数",
      qwertyOnly: "注：以下のオプションは Qwerty モードでのみ有効です",
      autoNext: "正しいスペルで自動的に次に進む",
      showPrevNext: "前の/次の単語を表示",
      hideWord: "単語を非表示",
      hideMeaning: "意味を非表示",
      enableSound: "音声を有効にする",
      volume: "音量",
      lang: "言語",
      darkMode: "ダークモード",
      enableAnimation: "アニメーションを有効にする",
    },
    userInfo: {
      nav: {
        basic: "基本情報",
        changePwd: "パスワードを変更する",
        changeAvatar: "アバターを変更する",
        deleteUser: "ユーザーを削除する",
      },
      basic: {
        errGetInfo: "ユーザー情報の取得に失敗しました。{err}",
        id: "ID",
        username: "ユーザー名",
        role: "ユーザーグループ",
        normalUser: "一般ユーザー",
        admin: "管理者",
        email: "メールアドレス",
        score: "スコア",
        save: "保存",
        inputPrompt: "新しいユーザー名とメールアドレスを入力してください",
        successPrompt: "保存に成功しました",
        errPrompt: "保存に失敗しました。{err}",
      },
      pwd: {
        originalPwd: "元のパスワード",
        newPasswd1: "新しいパスワード",
        newPasswd2: "新しいパスワードの確認",
        save: "保存",
        inputPrompt: "すべての情報を入力してください",
        samePrompt: "新しいパスワードは元のパスワードと同じです",
        diffPrompt: "新しいパスワードが一致しません",
        originalPwdPrompt: "元のパスワードが間違っています",
        successPrompt: "保存に成功しました",
        errPrompt: "保存に失敗しました。{err}",
      },
      avatar: {
        currAvatar: "現在のアバター",
        clickUpload: "新しいアバターをアップロードする",
        save: "保存",
        successPrompt: "保存に成功しました",
        errPrompt: "保存に失敗しました。{err}",
      },
      delete: {
        username: "削除するユーザー",
        passwd1: "パスワード",
        passwd2: "パスワードの確認",
        delete: "削除",
        confirm: "確認",
        cancel: "キャンセル",
        prompt: "プロンプト",
        deletePrompt:
          "このユーザーを削除してもよろしいですか？これにより、このユーザーのすべてのデータが削除され、元に戻すことはできません。",
        inputPrompt: "パスワードとパスワードの確認を入力してください",
        diffPrompt: "パスワードが一致しません",
        wrongPwdPrompt: "パスワードが間違っています",
        successPrompt: "削除に成功しました",
        errPrompt: "削除に失敗しました。{err}",
      },
    },
  },
};
