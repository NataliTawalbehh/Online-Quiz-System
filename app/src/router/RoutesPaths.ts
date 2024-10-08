export default class RoutesPaths {
  public static readonly ACCESS = '/';
  public static readonly HOME = '/student';
  public static readonly QUIZ = '/student/quize';
  public static readonly RESULTE = '/student/resulte';
  public static readonly QUESTION = '/student/quiz/:index';
  public static readonly SCORE = '/score';
  public static readonly TEACHER = '/teacher';
  public static readonly QUIZ_TEACHER = '/teacher/quiz'
  public static readonly RESULT_TEACHER = '/teacher/result'
  public static readonly CREATE_QUIZ = '/teacher/create_quiz'
  public static readonly STUDENT_GRADES = '/teacher/result/:index'
  public static readonly SCORE_RESULT = '/score_result'
}
